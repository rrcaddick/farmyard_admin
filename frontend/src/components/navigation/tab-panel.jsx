const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`menu-tabpanel-${index}`} {...other}>
      {value === index && <>{children}</>}
    </div>
  );
};

export default TabPanel;
