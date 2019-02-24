const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  appFrame: {
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  appBar: {
    position: 'absolute',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  'appBarShift-left': {
    marginLeft: drawerWidth,
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  'content-left': {
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  'contentShift-left': {
    marginLeft: 0,
  },
  mainLink: {
    color: '#FFF',
    textDecoration: 'none',
    fontSize: 18,
  },
  flexGrow: {
    flexGrow: 1,
  },
  logo: {
    height: 50,
    marginRight: 23,
    background: 'white',
  },
  userForm: {
    marginRight: 23,
  },
  select: {
    color: 'white',
  },
  option: {
    color: 'black',
  },
  focused: {
    color: 'white !important',
  },
  underline: {
    '&:before': {
      borderColor: 'white',
    },
  },
  userLabel: {
    color: 'white',
  },
  selectIcon: {
    color: 'white',
  },
  margin: {
    margin: theme.spacing.unit * 2,
  },
  padding: {
    padding: `0 ${theme.spacing.unit * 2}px`,
  },
  newsButton: {
    width: 'auto',
    paddingRight: '20px',
    borderRadius: 0,
  },
  badgeClass: {
    right: '-25px !important',
  },
  badgeContainer: {
    margin: theme.spacing.unit * 2,
  },
  newsMenu: {
    width: '400px',
    height: '1000px',
  },
  newsItem: {
    borderBottom: '1px solid #00000021',
    display: 'block',
    height: 'auto',
  },
  newsName: {
    float: 'left',
    clear: 'both',
  },
  newsTitle: {
    whiteSpace: 'normal',
    lineHeight: '14px',
    float: 'left',
    clear: 'both',
  },
  newsLink: {
    color: '#333333',
    textDecoration: 'none',
  },
  formRoot: {
    display: 'flex',
  },
  formControl: {
    margin: 0,
    width: '100%',
    padding: '0 30px',
    marginBottom: '30px',
  },
  formGroup: {
    margin: `${theme.spacing.unit}px 0`,
  },
  formLabel: {
    textAlign: 'left',
  },
  formLabelCorrect: {
    textAlign: 'left',
    background: '#00800078',
  },
  formFocus: {
    color: 'rgba(0, 0, 0, 0.54) !important',
  },
  radio: {
    padding: '5px',
  },
  correct: {
    position: 'relative',
    top: '5px',
    left: '-8px',
    color: 'green',
  },
  wrong: {
    position: 'relative',
    top: '6px',
    left: '-9px',
    color: 'red',
  },
  button: {
    width: '300px',
    margin: '0 auto',
    marginBottom: '100px',
  }
});

export default styles;
