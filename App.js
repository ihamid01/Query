
import './App.css';

import 'semantic-ui-css/semantic.min.css';

import { Button, Form, Select, Grid, Container, Segment, Input, Dropdown, Icon, Divider } from "semantic-ui-react";

import { restaurantIdOptions, transactionTimeOptions, operatorTypeOptions, measureOptions as compareTypeOptions, metricOptions } from 'npm/query/src/Utility.js';
import React, {useState, useEffect} from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


const initialFormData = {
    restaurantIds: [],
    fromDate: "",
    toDate: "",
    fromHour: 6,
    toHour: 29,
    metricCriteria: [{
        metricCode: [],
        compareType: [],
        value: "",
        operatorType: "And"
    }]
};


function App() {

    const [restaurantIds, setRestaurantIds] = useState([]);
    // const [fromHour, setFromHour] = useState(6);
    // const [toHour, setToHour] = useState(29);
    const [formData, setFormData] = useState(initialFormData);  
    // const [metricCriteria, setMetricCriteria] = useState([[{ Metric: [], compareType: [], value: ""}]]);
    const [compareType, setCompareType] = useState([]);
    const [operatorType, setOperatorType] = useState([]);


     const onSubmit = (async() => {
         console.log("in onsubmit")
        const request = {"RestaurantIds": [1],"FromDate": "2020-09-22T00:00:00", "ToDate": "2020-09-22T00:00:00","FromHour": 6, "ToHour": 29, "MetricCriteria":
        [{"CompareType": "GreaterThan", "OperatorType": null,"MetricCode": "NetAmount","Value": 35}]};
        JSON.stringify(request);
        const response = await fetch('https://customsearchqueryapi.azurewebsites.net/Search/Query', {
            method: 'POST',
            body: request,
            headers: {'Content-Type': 'application/json'}
        });
        
        const myJson = await response.json();
        console.log(myJson);
    });

    useEffect(async() => {

        const response = await fetch('https://customsearchqueryapi.azurewebsites.net/Search/MetricDefinitions');
        const myJson = await response.json(); //extract JSON from the http response

        console.log(myJson);

    }, []);


    function changeVal(data, index){
        const newFormData = {...formData}
        newFormData.metricCriteria[index]["value"] - Number(data.value);
        setFormData(newFormData)
    }

    function changeParams(propName, data){
        const newFormData = {...formData};
        newFormData[propName] = data.value;
        setFormData(newFormData);
    }

    function changeMetricCriteria(propName, data, index){
        const newFormData = {...formData};
        if (propName === "value"){
            newFormData.metricCriteria[index][propName] = Number(data.value)
        }
        else{
            newFormData.metricCriteria[index][propName] = data.value;
        }
    }

    const addCriteria = () => {
        const newFormData = {...formData};
        newFormData.metricCriteria.push(
            {
                metricCode: "",
                compareType: "",
                value: "",
                operatorType: "And"
            }
        )
        setFormData(newFormData);
    };

    const handleRemoveClick = (x) => {
        const newFormData = [...formData];
        newFormData.metricCriteria.splice(x, 1);
        setFormData(newFormData);
      };

    const [date, setDate] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);
    const handleChange = value => {
    setDate(value);
    setShowCalendar(false);
   };
       return (

           <div className="App">
           
               <Grid>
                   <Grid.Row>
                       <Container>
                           <Segment className="Segment">
                               <Grid centered>
                                   <Grid.Row columns="1">
                                       <Grid.Column textAlign="center">
                                           <h3>Custom Search Query Tool</h3>
                                       </Grid.Column>
                                   </Grid.Row>
                                   <Grid.Row columns="1">
                                       <Grid.Column>
                                           <Form onSubmit={() => onSubmit()}>
                                               <Form.Field>
                                                   <label style={{ fontWeight: "bold" }}>Restaurant Id</label>
                                                   <Dropdown

                                                       options={restaurantIdOptions}
                                                       placeholder={"Select Restaurant Id"}
                                                       multiple
                                                       selection
                                                       value={formData.restaurantIds}
                                                       onChange={(event, data) => changeParams( "restaurantIds", data)}
                                                        />
                                               </Form.Field>
                                               <Form.Group>
                                                   <Form.Field
                                                       control={Select}
                                                       label={"Transaction Time Start"}
                                                       options={transactionTimeOptions}
                                                       value={formData.fromHour}
                                                       onChange={(event, data) => changeParams("fromHour", data)} />
                                                   <Form.Field
                                                       control={Select}
                                                       label={"Transaction Time End"}
                                                       options={transactionTimeOptions}
                                                       value={formData.toHour}
                                                       onChange={(event, data) => changeParams("toHour", data)} />
                                                       
                                               </Form.Group>
                                               <Form.Group>
                                                   <Form.Field>
                                                       <Button onClick={() => addCriteria()} color="violet">Add Criteria</Button>
                                                   </Form.Field>
                                               </Form.Group>
                                               <Form.Field>
                                                   <Button color="olive" type="submit">
                                                       Submit
                                                   </Button>
                                               </Form.Field>
                                           </Form>
                                       </Grid.Column>
                                   </Grid.Row>
                                   <Grid.Row>
                                       <Grid.Column>
                                           {/* <Form>
                                               <Form.input>
                                               <Form.Input style={{ width: 170 }}  label='Date' control={Calendar}
                                                className={showCalendar ? "" : "hide"}
                                                value={date}
                                                onChange={handleChange}    onFocus={() => setShowCalendar(true)} /> 
                                                    
                                                  
                                               </Form.input>
                                               
                                           </Form> */}
                                       <div className='calendar-container'>
                                            <p style={{ position: 'relative', left: 200 }}>Select Date:
                                                <input
                                                    value={date.toLocaleDateString()}
                                                    onFocus={() => setShowCalendar(true)}
                                                    readOnly={true} />
                                            </p>
                                            <Calendar
                                                className={showCalendar ? "" : "hide"}
                                                value={date}
                                                onChange={handleChange} />
                                            {/* <Calendar onChange={setDate} value={date} /> */}
                                        </div>
                                       </Grid.Column>
                                   </Grid.Row>
                                   <Grid.Row>
                                       <Grid.Column>
                                       {formData.metricCriteria.map((x, i) => {
                                        return(
                                           <Form key={i}>
                                               {formData.metricCriteria.length > 1 &&
                                                    <Form.Field>
                                                        <Button onClick={() => handleRemoveClick(i)}  color="violet">Remove</Button>
                                                    </Form.Field>
                                                }
                                               <Form.Field>
                                                   <label style={{ fontWeight: "bold" }}>Metric</label>
                                                   <Dropdown
                                                       options={metricOptions}
                                                       placeholder={"Select Metric"}
                                                       multiple
                                                       selection
                                                       value={formData.metricCriteria[i].metricCode}
                                                       onChange={(event, data) => changeMetricCriteria("metricCode", data, i)}
                                                        />
                                               </Form.Field>
                                               <Form.Field>
                                                   <label style={{ fontWeight: "bold" }}>Metric</label>
                                                   <Dropdown
                                                       options={compareTypeOptions}
                                                       placeholder={"Type"}
                                                       multiple
                                                       selection
                                                       value={formData.metricCriteria[i].compareType}
                                                       onChange={(event, data) => {changeMetricCriteria("compareType", data, i); setCompareType(data.value)}}
                                                        />
                                               </Form.Field>
                                               
                                               <Form.Field
                                            
                                                   control={Input}
                                                   label={"Value"}
                                                   value={formData.metricCriteria[i].value}
                                                   onChange={(event, data) => changeVal(data.value, i)}
                                               />
                                               <Form.Field>
                                                   <label style={{ fontWeight: "bold" }}>Operator</label>
                                                   <Dropdown
                                                       options={operatorTypeOptions}
                                                       placeholder={"Operator Type"}
                                                       multiple
                                                       selection
                                                       value={formData.metricCriteria[i].operatorType}
                                                       onChange={(event, data) => {changeMetricCriteria("operatorType", data, i); setOperatorType(data.value)}}
                                                        />
                                               </Form.Field>
                                           </Form>
                                              );
                                            })}
                                       </Grid.Column>
                                   </Grid.Row>
                               </Grid>
                           </Segment>
                       </Container>
                   </Grid.Row>
                   <Divider hidden></Divider>
                   <Grid.Row>
                       <Container>
                           <Segment>
                               <h3>Results</h3>
                               <div className='App-container'>
        <table style={{position: 'relative', left: 20}}>
          <thead>
            <tr>
              <th>RestaurantID</th>
              <th>BusDate</th>
              <th>Order #</th>
              <th>OrderTime</th>
              <th>TotalAmount</th>
              <th>NetAmount</th>
              <th>ItemsSold</th>
              <th>BeverageQty</th>
              <th>DiscountAmount</th>
              <th>ItemsDeleted</th>
              <th>DiscountRatio</th>            
              <th>Refund</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>2020-09-22</td>
              <td>1</td>
              <td>2020-09-22 00:07:00</td>
              <td>2</td>
              <td>1.5</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>

            </tr>
          </tbody>

        </table>
      </div>
                           </Segment>
                       </Container>
                   </Grid.Row>
               </Grid>
           </div>
       );

}

 

export default App;

 

 

 

 

 

 
