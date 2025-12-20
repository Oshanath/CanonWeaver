import {AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography} from '@mui/material';
import React from "react";

function CWAppBar() {

    const menus = ['File', 'Project', 'Settings'];

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" onClick={() => console.log("logo click")} sx={{ mr: 1 }}>
                        <Box
                            component="img"
                            src="logo-no-bg.png"         // or import logo from "./logo.png"
                            alt="My App"
                            sx={{ height: 70, width: "auto", display: "block" }}
                        />
                    </IconButton>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {menus.map((menu) => (
                            <Button
                                key={menu}
                                // onClick={handleCloseNavMenu}
                                color= 'inherit'
                                sx={{ my: 2, display: 'block' }}
                            >
                                {menu}
                            </Button>
                        ))}
                    </Box>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default CWAppBar;