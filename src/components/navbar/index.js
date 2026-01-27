import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';

function Navbar() {
  

  return (
    <Sidebar style={{
      position: 'fixed',
  
      height: '100%',
    }}>
  <Menu>
    <SubMenu label="Charts">
      <MenuItem> Pie charts </MenuItem>
      <MenuItem> Line charts </MenuItem>
    </SubMenu>
    <MenuItem> Documentation </MenuItem>
    <MenuItem> Calendar </MenuItem>
  </Menu>
</Sidebar>
  );
}
export default Navbar;
