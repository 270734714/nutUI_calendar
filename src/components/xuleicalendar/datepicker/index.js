import DatePicker from './datepicker.vue';

DatePicker.install = function(Vue) {
  Vue.component(DatePicker.name, DatePicker);
};

export default DatePicker;
