import { createStore, combineReducers } from 'redux'
import axios from 'axios'

export async function getData(url : string, params: any){

  let user = "Доставка"
  let password = ""

  let res = await axios.post(
      URL + url
      ,params
      ,{
        auth: {
          username: unescape(encodeURIComponent(user)),
          password: unescape(encodeURIComponent(password))
        }
      } 
    ).then(response => response.data)
    .then((data) => {
        if(data.Код === 200) console.log(data) 
        return data
    }).catch(error => {
      console.log(error)
      return {Код: 200, Описание: error}
    })

  return res

}

export interface s_type {
    НомерЗаказа: string
    Сумма: number
    Адрес: string
    Статус: string
}

export interface i_type{
  Код:          string
  Наименование: string
  Вес:          number
  Цена:         number
  Описание:     string
  Картинка:     string
  Количество:   number
}

export interface b_type{
  Код: string
  Наименование: string
  Цена: number
  Количество: number
  Всего: number
  Картинка: string
}

interface IState{
    basket: Array<b_type>
    info: {
        address: String
        phone: String
    }
}

const     initialState: IState | any = {
  basket: [],
  info: {fio: "", address: "", phone: ""}
}

function  basketReducer(state = initialState.basket, action) {
  switch(action.type){
    case "add_basket":
      return[
        ...state, action.data
      ]     
    case "upd_basket":
      return state.map(todo => {
        if (todo.Код === action.data.Код) {
          return { ...todo, Количество: action.data.Количество, Всего: action.data.Всего}
        }
        return todo
      })  
    case "cl_basket":
      return []
    default: return state
  }

}

function  infoReducer(state = initialState.info, action) {
  switch(action.type) {
      case "info": {
              return {...state, 
                fio:      action.fio,
                phone:    action.phone, 
                address:  action.address 
              }     
          }
      default: return state;
  }
}

const     rootReducer = combineReducers({
     
  basket: basketReducer,
  info: infoReducer,

})



function create_Store(reducer, initialState) {
  var currentReducer = reducer;
  var currentState = initialState;

  var l_basket = () => {};

  return {
      getState() {
          return currentState;
      },
      dispatch(action) {
          currentState = currentReducer(currentState, action);
          switch(action.type){            
              case "add_basket": l_basket();break                
              case "cl_basket": l_basket();break                
              case "upd_basket": l_basket();break                
              case "basket": l_basket();break
          }
          return action;
      },
      
      subsribe_l_basket(newListener) {
          l_basket  = newListener
      },
  };
}

export const Store = create_Store(rootReducer, initialState)
export const URL = "https://mfu24.ru/counter/hs/MyAPI/V1/"