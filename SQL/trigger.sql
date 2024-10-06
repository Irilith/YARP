CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.random <> OLD.random THEN
        NEW.updated_at = CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_anime_defender_timestamp
BEFORE UPDATE ON anime_defender
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
