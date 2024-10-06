use bcrypt::{verify, BcryptError};

pub fn check_password(password: &str, stored_hash: &str) -> Result<bool, BcryptError> {
    match verify(password, stored_hash) {
        Ok(is_valid) => Ok(is_valid),
        Err(err) => Err(err),
    }
}
