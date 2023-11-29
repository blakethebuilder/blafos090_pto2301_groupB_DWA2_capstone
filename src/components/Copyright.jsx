

import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';



 export default function Copyright(props) {
    return (
      <Typography variant="body2" color="secondary" align="center" {...props}>
        {'Copyright © '}
        <Link  >
          blakethebuiler  
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
        <br/>
        All Rights Reserved
      </Typography>
    );
  }
