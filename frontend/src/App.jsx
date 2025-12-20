import {Box} from '@mui/material';
import CWAppBar from './CWAppBar.jsx'
import CWWorkspace from "./CWWorkspace.jsx";

function App() {
  return (
      <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        <CWAppBar />
        <CWWorkspace />
      </Box>
  );
}

export default App;
