import Vue from 'vue'
import {Button,
    FormItem,
    Form,
    Input,
    Divider,
    Message,
    RadioGroup,
    RadioButton,
    Row,Col,Menu,
    Submenu,MenuItemGroup,
    MenuItem,Header,Container,
    Aside,Main,Breadcrumb,BreadcrumbItem,Card,Table,TableColumn,Switch,tooltip,pagination,dialog,
    select,option,Tag,MessageBox,tree} from 'element-ui'


Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Divider)
Vue.use(RadioButton)
Vue.use(RadioGroup)
Vue.use(Row)
Vue.use(Col)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Header)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(tooltip)
Vue.use(pagination)
Vue.use(dialog)
Vue.use(select)
Vue.use(option)
Vue.use(Tag)
Vue.use(tree)
Vue.prototype.$message=Message
Vue.prototype.$confirm=MessageBox.confirm
