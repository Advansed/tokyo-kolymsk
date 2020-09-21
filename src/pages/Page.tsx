import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonRow, IonCol, IonCardSubtitle, IonCardTitle, IonCardContent, IonButton, IonItem, IonLabel, IonInput, IonIcon, IonText, IonImg, IonList, IonFooter } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router';
import MaskedInput  from '../mask/reactTextMask'
import { AddressSuggestions } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';

import './Page.css';
import { getData, i_type, Store, b_type } from '../Store';
import update from 'immutability-helper';
import { closeOutline, addCircleOutline, removeCircleOutline } from 'ionicons/icons';
import { setupMaster } from 'cluster';
import { info } from 'console';
import { stringify } from 'querystring';

declare type Dictionary = {
  [key: string]: any;
};


const Page: React.FC = () => {
  const [param, setParam]       = useState<Array<i_type>>([]);
  const [b_length, setBLength]  = useState(0);


  const hist = useHistory();


  let item : Dictionary = {"city": "Среднеколымск"};
  let  dict: Dictionary[] = []; dict.push(item);

  const { name }                = useParams<{ name: string; }>();
  Store.subsribe_l_basket(()=>{
    let basket = Store.getState().basket;
    let sum = 0;
    if(basket !== undefined)
      basket.forEach(info => {
        sum = sum + info.Количество
      });
    setBLength(sum);
  })

  useEffect(()=>{

    async function load(){
       let res = await getData("Прайс", {}) 
       if(res.Код === 100){
          setParam(res.Данные)
          console.log( param )
       } 
    }

    load();

  }, [])

  function  addBasket(good:any, amount: number){
    let basket = Store.getState().basket;

    if(basket === undefined) basket = [];

    var commentIndex = basket.findIndex(function(b) { 
        return b.Код === good.Код; 
    });
    if(commentIndex >= 0){
      let b_amount = basket[commentIndex].Количество
      let sum = b_amount + (amount as number);
      let total = basket[commentIndex].Цена * sum;

      var updated = update(basket[commentIndex], {Количество: {$set: sum}, Всего: {$set: total}}); 

      Store.dispatch({type: "upd_basket", data: updated})

    } else {
      Store.dispatch({type: "add_basket", 
        data: {
          Код:            good.Код,
          Наименование:   good.Наименование,
          Цена:           good.Цена,
          Количество:     amount,
          Всего:          amount * good.Цена,
          Картинка:       good.Картинка
        }
      })
    }
  }

  function  delBasket(Код: string){
    let basket = Store.getState().basket;

    if(basket === undefined) basket = [];

    var commentIndex = basket.findIndex(function(b) { 
        return b.Код === Код; 
    });
    if(commentIndex >= 0){
      basket.splice(commentIndex, 1)
      Store.dispatch({type:"basket", data: basket})
    }
  }

  function  updBasket(Код: string, amount: number){
    let basket = Store.getState().basket;

    if(basket === undefined) basket = [];

    var commentIndex = basket.findIndex(function(b) { 
        return b.Код === Код; 
    });
    if(commentIndex >= 0){
      let b_amount = basket[commentIndex].Количество
      let sum = b_amount + amount;
      let total = basket[commentIndex].Цена * sum;

      if(sum === 0) delBasket(Код)
      else {
        var updated = update(basket[commentIndex], {Количество: {$set: sum}, Всего: {$set: total}}); 

        Store.dispatch({type: "upd_basket", data: updated})
      }

    }
  }

  async function  Order(){
    let basket = Store.getState().basket;
    let info = Store.getState().info;

    let params = {
      ФИО:      info.fio,
      Телефон:  info.phone,
      Адрес:    info.address,
      Корзина:  basket
    }
     
    let res = await getData("Заказ", params);
    if(res.Код ===  100){
      
    }
  }

  function  Catalog (props:{info}):JSX.Element {

    let info = props.info;

 
  console.log("Каталог")
    let item = <></>;
    for (let i = 0; i < info.length;i++){
      item = <>
        { item }
        <IonCard onClick={() => {
          addBasket(info[i], 1);
        }} >
          <IonCardHeader>
            <IonRow>
              <IonCol>
                <img src={info[i].Картинка} alt=""/>
              </IonCol>
              <IonCol id="icard-col1">
                <IonCardSubtitle>Код: "{ info[i].Код }"</IonCardSubtitle>
                <IonCardSubtitle>Вес:  { info[i].Вес }</IonCardSubtitle>
                <IonCardSubtitle>Цена: { info[i].Цена }</IonCardSubtitle>

              </IonCol>
            </IonRow>
            <IonCardTitle>{info[i].Наименование}</IonCardTitle>
          </IonCardHeader>  
          <IonCardContent>
            {info[i].Описание}
          </IonCardContent>
        </IonCard>

      </>
    }

    return item;
  }

  function  BItem(props:{info : b_type}):JSX.Element{
    let info = props.info;
    return <>
      <IonRow class="r-underline">
        <IonCol><IonImg id="a-margin" src={info.Картинка}/></IonCol>
        <IonCol size="8">
          <IonCardSubtitle> {info.Наименование} </IonCardSubtitle>
          <IonCardTitle class="t-right"> 
            { info.Цена } Х { info.Количество } = { info.Всего}
          </IonCardTitle>
          <IonRow>
            <IonCol class="i-col">
              <IonButton class="i-but" fill="clear" onClick={()=>{
                updBasket(info.Код, 1)
              }}>
                <IonIcon slot="icon-only" icon={ addCircleOutline }>
                </IonIcon>
              </IonButton>
            </IonCol>
            <IonCol class="i-col">
              <IonButton class="i-but" fill="clear" onClick={()=>{
                updBasket(info.Код, -1)
              }}>
                <IonIcon slot="icon-only" icon={ removeCircleOutline }>
                </IonIcon>
              </IonButton>
            </IonCol>
            <IonCol class="i-col">
              <IonButton class="i-but" fill="clear" onClick={()=>{
                delBasket( info.Код )
              }}>
                <IonIcon slot="icon-only" icon={ closeOutline }>
                </IonIcon>
              </IonButton>
            </IonCol>

          </IonRow>
        </IonCol>
    </IonRow>
    </>

  }

  function  Basket(props:{blen: number}):JSX.Element{

    let b_length = props.blen;

    let basket = Store.getState().basket;

    let items = <IonCardSubtitle> Всего товаров { b_length }</IonCardSubtitle>

    let sum = 0;
    for(let i = 0;i < basket.length;i++){
      sum = sum + basket[i].Всего;
      items = <>
        { items }
        <BItem info={ basket[i] } />
      </>
    }

    items = <>
      <IonCard>
        <IonCardHeader class="a-center">
          <IonCardTitle>  Лист заказа </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          { items }
        </IonCardContent>
        <IonFooter>
          <IonItem>
            <IonLabel> Итого на сумму </IonLabel>
            <IonText class="a-right">
              { sum }
            </IonText>
          </IonItem>
          <IonToolbar>
            <IonRow>
              <IonCol>
                <IonButton expand="block" onClick={()=>{
                  Store.dispatch({type: "cl_basket"})
                  hist.goBack();
                }}> Очистить заказ 
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton expand="block" onClick={()=>{
                  hist.push("/page/Заказ")
                }}> Заказать 
                </IonButton>
              </IonCol>
            </IonRow>
            </IonToolbar>
        </IonFooter>
      </IonCard>
    </>

    return items
  }

  function  OrderBill():JSX.Element {
    let basket = Store.getState().basket
    let total = 0;
    basket.forEach(elem => {
      total = total + elem.Всего
    });
    let elem = <>
      <IonCard>
        <IonCardHeader class="a-center">
          <IonCardTitle> Сведения о заказе</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonList>
            <IonItem>
              <IonLabel position="stacked">Обращение</IonLabel>
              <IonInput 
                placeholder="Иван Иванович И." 
                value = { Store.getState().info.fio }
                onIonChange={(e)=>{
                  Store.dispatch({type:"info", fio: e.detail.value})
              }}>

              </IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Телефон</IonLabel>
              <MaskedInput
                    mask={['+', /[1-9]/, '(', /\d/, /\d/, /\d/,')', /\d/, /\d/, /\d/,  '-', /\d/, /\d/, '-', /\d/, /\d/]}
                    className="m-input"
                    autoComplete="off"
                    id='1'
                    value = { Store.getState().info.phone }
                    placeholder = "+7(914)222-22-22"
                    type='text'
                    onChange={(e) => {
                      Store.dispatch({type: "info", phone: (e.target.value as string)})
     
                    }}
                />
            </IonItem>
            <IonLabel class="i-label">Адрес</IonLabel>
            <AddressSuggestions 
                // ref={suggestionsRef} 
                token="23de02cd2b41dbb9951f8991a41b808f4398ec6e"
                filterLocations ={ dict }
                hintText = "г. Среднеколымск"
                onChange={(e)=>{
                  if(e !== undefined)
                    Store.dispatch({type: "info", address: e.value})
                }}
            
            /> 
            <IonItem>
              <IonLabel> Сумма доставки </IonLabel>
              <IonText class="a-right"> 100 руб </IonText>
            </IonItem>
            <IonItem>
              <IonLabel> Сумма заказа </IonLabel>
              <IonText class="a-right"> { total } руб </IonText>
            </IonItem>
            <IonItem>
              <IonLabel> Итого к оплате  </IonLabel>
              <IonText class="a-right"> { total + 100 } руб </IonText>
            </IonItem>
          </IonList>
        </IonCardContent>
        <IonToolbar>
          <IonButton slot="end" onClick={()=>{
            Store.dispatch({type:"cl_basket"})
            hist.push("/page/Каталог");
            Order();
          }}>
            Заказать
          </IonButton>
        </IonToolbar>
      </IonCard>
    
    </>;
    return elem;
  }

  function  IContent():JSX.Element {

    let elem = <></>;
    console.log("контент")

    switch(name) {

      case "Каталог": return <Catalog info = { param } />

      case "Корзина": return <Basket blen={b_length} />

      case "Заказ":   return <OrderBill />
    }

    return elem;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{ name }</IonTitle>
          <IonButton slot="end" fill="clear" onClick={()=>{
            hist.push("/page/Корзина")
          }}>
            <IonIcon slot="icon-only" src="assets/icon/basket.svg" />
            <IonText class="red-1"> { b_length } </IonText>
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IContent />
      </IonContent>
    </IonPage>
  );
};

export default Page;
