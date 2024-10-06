import React, { useState, useEffect } from 'react';
import { authKey } from '~/utils/Cookies';
import { StatsBox } from '~/components/Stats';
import { BaseAccount, GameConfig } from '~/components/Sections/Base/Props';
import { ItemList, Items } from '~/components/Items';
import { fnb } from '~/utils/Format';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '~/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

import { Checkbox } from '~/components/ui/checkbox';
type AccountDataProps = {
  gameConfig: GameConfig;
  items: Array<{ name: string; key: string }>;
};

export const AccountData: React.FC<AccountDataProps> = ({
  gameConfig,
  items,
}) => {
  const [accounts, setAccounts] = useState<BaseAccount[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<BaseAccount[]>([]);
  const [search, setSearch] = useState<string>('');
  const [pcFilter, setPcFilter] = useState<string>('All');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [onlineCount, setOnlineCount] = useState<number>(0);
  const [offlineCount, setOfflineCount] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  } | null>(null);
  const [itemsWithValues, setItemsWithValues] = useState<Items>({ Item: [] });
  const [goToPage, setGoToPage] = useState<number | ''>('');
  const [lastDataLength, setLastDataLength] = useState<number>(0);

  // Data fetching and processing
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8081/data/${gameConfig.endpoint}/${authKey}`,
        );
        const data = await response.json();
        setAccounts(data);
        updateStats(data);
        updateFilteredAccounts(data);
        updatePageIfNeeded(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, [sortConfig, lastDataLength, gameConfig.endpoint]);

  const updateStats = (data: BaseAccount[]) => {
    const online = data.filter(
      account => getStatus(account.updated_at) === 'Online',
    ).length;
    const offline = data.length - online;
    setOnlineCount(online);
    setOfflineCount(offline);
  };

  const updateFilteredAccounts = (data: BaseAccount[]) => {
    let filtered = data;
    if (sortConfig) {
      filtered = sortAccounts(filtered, sortConfig);
    }
    setFilteredAccounts(filtered);
  };

  const updatePageIfNeeded = (data: BaseAccount[]) => {
    if (data.length !== lastDataLength) {
      setCurrentPage(1);
      setLastDataLength(data.length);
    }
  };

  // Filtering and sorting
  useEffect(() => {
    let filtered = accounts;
    filtered = applyFilters(filtered);
    if (sortConfig) {
      filtered = sortAccounts(filtered, sortConfig);
    }
    setFilteredAccounts(filtered);
  }, [search, pcFilter, statusFilter, accounts, sortConfig]);

  const applyFilters = (data: BaseAccount[]) => {
    if (pcFilter && pcFilter !== 'All') {
      data = data.filter(account => account.computer === pcFilter);
    }
    if (statusFilter && statusFilter !== 'All') {
      data = data.filter(
        account => getStatus(account.updated_at) === statusFilter,
      );
    }
    if (search) {
      data = data.filter(account =>
        account.name.toLowerCase().includes(search.toLowerCase()),
      );
    }
    return data;
  };

  const sortAccounts = (
    data: BaseAccount[],
    config: { key: string; direction: string },
  ) => {
    return [...data].sort((a, b) => {
      if (a[config.key] < b[config.key]) {
        return config.direction === 'asc' ? -1 : 1;
      }
      if (a[config.key] > b[config.key]) {
        return config.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAccounts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);

  // Account selection and delete
  const handleSelectAccount = (name: string) => {
    setSelectedAccounts(prev =>
      prev.includes(name)
        ? prev.filter(account => account !== name)
        : [...prev, name],
    );
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8081/data/${gameConfig.endpoint}/delete`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key: authKey,
            username: selectedAccounts.length > 0 ? selectedAccounts : [''],
          }),
        },
      );
      const result = await response.text();
      console.log('Delete response:', result);
    } catch (error) {
      console.error('Error deleting accounts:', error);
    }
  };

  // Utility functions
  const getStatus = (updatedAt: string): string => {
    const now = new Date();
    const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    const updatedDate = new Date(updatedAt.slice(0, 19));
    const diffInSeconds =
      Math.abs(utcNow.getTime() - updatedDate.getTime()) / 1000;

    return diffInSeconds < 60 ? 'Online' : 'Offline';
  };

  const sortData = (key: string) => {
    let direction = 'asc';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleGoToPage = () => {
    if (goToPage && goToPage >= 1 && goToPage <= totalPages) {
      setCurrentPage(goToPage);
    }
  };

  // Calculate total stats
  useEffect(() => {
    const calculateTotalStats = () => {
      const totals: { [key: string]: number } = {};

      accounts.forEach(account => {
        items.forEach(item => {
          const value = parseFloat(account[item.key] as unknown as string);
          if (!isNaN(value)) {
            totals[item.key] = (totals[item.key] || 0) + value;
          }
        });
      });

      return totals;
    };

    const totalStats = calculateTotalStats();

    setItemsWithValues({
      Item: items.map(item => ({
        name: item.name,
        value: fnb(totalStats[item.key]) || 0,
        image: `/assets/${item.key}.webp`,
      })),
    });
  }, [accounts, items]);

  return (
    <>
      <div className="grid grid-cols-3 gap-4 items-center justify-center align-center mb-6">
        <StatsBox
          title="Online"
          value={onlineCount.toString()}
          color="text-green-500"
        />
        <StatsBox
          title="Offline"
          value={offlineCount.toString()}
          color="text-red-500"
        />
        <StatsBox
          title="Total"
          value={(onlineCount + offlineCount).toString()}
          color="text-blue-500"
        />
      </div>

      <ItemList items={itemsWithValues} />

      <div className="bg-gray-900 shadow-md rounded-lg p-6 mt-6 text-white">
        <h2 className="text-2xl font-bold mb-6">
          {gameConfig.name} Account Data
        </h2>

        <div className="flex flex-wrap justify-between mb-6">
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <Input
              type="text"
              placeholder="Search Username"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-nowrap gap-4 overflow-x-auto">
            <Select value={pcFilter} onValueChange={setPcFilter}>
              <SelectTrigger className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-md">
                <SelectValue placeholder="All PCs" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border border-gray-600 text-white">
                <SelectItem value="All">All PCs</SelectItem>
                {Array.from(
                  new Set(accounts.map(account => account.computer)),
                ).map(pc => (
                  <SelectItem key={pc} value={pc}>
                    {pc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-md">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border border-gray-600 text-white">
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Online">Online</SelectItem>
                <SelectItem value="Offline">Offline</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
            >
              Delete Selected
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center mb-6">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <label htmlFor="itemsPerPage" className="text-sm">
              Show:
            </label>
            <Select
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={itemsPerPage.toString()}
              onValueChange={value => setItemsPerPage(Number(value))}
            >
              <SelectTrigger className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-md w-[100px]">
                <SelectValue placeholder="25" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border border-gray-600 text-white w-[100px]">
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={goToPage === '' ? '' : goToPage}
              onChange={e =>
                setGoToPage(e.target.value ? Number(e.target.value) : '')
              }
              placeholder="Go to page"
              className="w-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              onClick={handleGoToPage}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            >
              Go
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-400">
            Showing {indexOfFirstItem + 1} to{' '}
            {Math.min(indexOfLastItem, filteredAccounts.length)} of{' '}
            {filteredAccounts.length} entries
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 bg-gray-700 text-white rounded-md ${
                currentPage === 1
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-600'
              } transition duration-300`}
            >
              Previous
            </button>
            <div className="text-white px-4 py-2 bg-gray-700 rounded-md">
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={() =>
                setCurrentPage(prev => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-4 py-2 bg-gray-700 text-white rounded-md ${
                currentPage === totalPages
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-600'
              } transition duration-300`}
            >
              Next
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] text-white">
                  <Checkbox
                    onCheckedChange={checked =>
                      setSelectedAccounts(
                        checked
                          ? filteredAccounts.map(account => account.name)
                          : [],
                      )
                    }
                    checked={
                      selectedAccounts.length > 0 &&
                      selectedAccounts.length === filteredAccounts.length
                    }
                  />
                </TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">PC</TableHead>
                {Array.isArray(gameConfig.columns) &&
                  gameConfig.columns
                    .filter(column => column.enable)
                    .map(column => (
                      <TableHead
                        key={column.key}
                        className={`text-white ${
                          column.sortable ? 'cursor-pointer' : ''
                        }`}
                        onClick={() => column.sortable && sortData(column.key)}
                      >
                        {column.label}
                        {sortConfig && sortConfig.key === column.key && (
                          <span className="ml-1">
                            {sortConfig.direction === 'asc' ? '▲' : '▼'}
                          </span>
                        )}
                      </TableHead>
                    ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map(account => (
                <TableRow key={account.key}>
                  <TableCell>
                    <Checkbox
                      checked={selectedAccounts.includes(account.name)}
                      onCheckedChange={() => handleSelectAccount(account.name)}
                    />
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        getStatus(account.updated_at) === 'Online'
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      }`}
                    >
                      {getStatus(account.updated_at)}
                    </span>
                  </TableCell>
                  <TableCell className="text-white">
                    {account.computer}
                  </TableCell>
                  {Array.isArray(gameConfig.columns) &&
                    gameConfig.columns
                      .filter(column => column.enable)
                      .map(column => (
                        <TableCell key={column.key} className="text-white">
                          {account[column.key]}
                        </TableCell>
                      ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-400">
            Showing {indexOfFirstItem + 1} to{' '}
            {Math.min(indexOfLastItem, filteredAccounts.length)} of{' '}
            {filteredAccounts.length} entries
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 bg-gray-700 text-white rounded-md ${
                currentPage === 1
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-600'
              } transition duration-300`}
            >
              Previous
            </button>
            <div className="text-white px-4 py-2 bg-gray-700 rounded-md">
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={() =>
                setCurrentPage(prev => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-4 py-2 bg-gray-700 text-white rounded-md ${
                currentPage === totalPages
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-600'
              } transition duration-300`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
