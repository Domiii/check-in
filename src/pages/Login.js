import React from 'react';

import Button from '@material-ui/core/Button';
import { login } from 'api/auth';


export default function Login() {
  return (
    <div className="full-center">

      <Button
        aria-haspopup="true"
        variant="contained"
        color="primary"
        onClick={login}
      >
        <span className="font-size-2">
          <img className="size-1"
            alt="GoogleLogo"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" />
          {" "}Sign-in with Google
          </span>
      </Button>
    </div>
  );
}