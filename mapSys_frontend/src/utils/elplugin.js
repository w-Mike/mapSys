import {
  Button, 
  Select,
  Form,
  FormItem,
  Input,
  DatePicker,
  TimePicker,
  Option,
  OptionGroup,
  Row,
  Col,
  Upload,
  Tag
} from 'element-ui'

export default {
  install:function(Vue){
    Vue.use(Upload)
    Vue.use(Button)
    Vue.use(Select)
    Vue.use(Form)
    Vue.use(FormItem)
    Vue.use(Input)
    Vue.use(DatePicker)
    Vue.use(TimePicker)
    Vue.use(Option)
    Vue.use(OptionGroup)
    Vue.use(Row),
    Vue.use(Col),
    Vue.use(Tag)
  }
}

