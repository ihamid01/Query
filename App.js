import './App.css';
import 'semantic-ui-css/semantic.min.css';
import 'react-datez/dist/css/react-datez.css';
import { Button, Form, Select, Grid, Container, Segment, Input, Dropdown, Icon, Pagination } from "semantic-ui-react";
import { restaurantIdOptions, transactionTimeOptions, compareTypeOptions, metricOptions, operatorTypeOptions, postData, getData, formatData } from './Utility';
import React, {useEffect, useState} from "react";
import { ReactDatez } from 'react-datez';
import moment from "moment";

const initialFormData= {
    restaurantIds: [], // array
    fromDate: "", 
    toDate: "", 
    fromHour: 6, 
    toHour: 29, 
    metricCriteria: [{
        metricCode: "", 
        compareType: "", 
        value: "",
        operatorType: "And" 
    }] // array of metric criteria
};

const itemsPerPage = 20;

function App() {
    const [theForm, settheForm] = useState(initialFormData);
    const [metricDefinitions, setMetricDefinitions] = useState([]);
    const [theResults, settheResults] = useState([]);
    const [activePage, setactivePage] = useState(1);

    useEffect(() => {
        getData("https://customsearchqueryapi.azurewebsites.net/Search/MetricDefinitions")
            .then(data => {
                setMetricDefinitions(data);
            });
    }, []);

    function onSubmit() {
        postData("https://customsearchqueryapi.azurewebsites.net/Search/Query", theForm)
            .then(data => {
                settheResults(data);
            });
    }

    function changeParams(propName, value) {
        const newtheForm = {...theForm};
        newtheForm[propName] = value;
        settheForm(newtheForm);
    }

    function changePage(data) {
        setactivePage(data.activePage);
    }


    function changeMetricCriteria(propName, data, i) {
        const newtheForm = {...theForm};

        if (propName === "value") {
            newtheForm.metricCriteria[i][propName] = Number(data.value);
        } else {
            newtheForm.metricCriteria[i][propName] = data.value;
        }
        
        settheForm(newtheForm);
    }

    function addCriteria() {
        const newtheForm = {...theForm};
        newtheForm.metricCriteria.push(
            {
                metricCode: "",
                compareType: "",
                value: "",
                operatorType: "And"
            }
        );
        settheForm(newtheForm);
    }

    function removeCriteria(i) {
        const newtheForm = {...theForm};
        newtheForm.metricCriteria.splice(i, 1)
        settheForm(newtheForm);
    }


    const slicedtheResults = theResults.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

    return (
        <div className="App">
            <Grid className="Grid">
                <Grid.Row>
                    <Container className="Container" fluid>
                        <Segment className="Segment">
                            <Grid centered>
                                <Grid.Row columns="1">
                                    <Grid.Column textAlign="center">
                                        <h2>Custom Search Query Tool</h2>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row columns="1">
                                    <Grid.Column>
                                        <Form onSubmit={() => onSubmit()}>
                                            <Form.Field>
                                                <label style={{fontWeight: "bold"}}>Restaurant Id</label>
                                                <Dropdown
                                                    options={restaurantIdOptions}
                                                    placeholder={"Select Restaurant Id"}
                                                    multiple
                                                    selection
                                                    onChange={(event, data) => changeParams("restaurantIds", data.value)}
                                                    value={theForm.restaurantIds}
                                                />
                                            </Form.Field>
                                            <Form.Group>
                                                <Form.Field>
                                                    <label style={{fontWeight: "bold"}}>From Date</label>
                                                    <ReactDatez
                                                        name="dateInput"
                                                        handleChange={(value) => {changeParams("fromDate", moment(value).format("YYYY-MM-DD"))}}
                                                        value={theForm.fromDate}
                                                        allowPast={true}
                                                        dateFormat={"MM/DD/YYYY"}
                                                        placeholder={"MM/DD/YYYY"}

                                                    />
                                                </Form.Field>
                                                <Form.Field>
                                                    <label style={{fontWeight: "bold"}}>To Date</label>
                                                    <ReactDatez
                                                        name="dateInput"
                                                        handleChange={(value) => {changeParams("toDate", moment(value).format("YYYY-MM-DD"))}}
                                                        value={theForm.toDate}
                                                        allowPast={true}
                                                        dateFormat={"MM/DD/YYYY"}
                                                        placeholder={"MM/DD/YYYY"}
  
                                                    />
                                                </Form.Field>
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Field
                                                    control={Select}
                                                    label={"Transaction Time Start"}
                                                    options={transactionTimeOptions}
                                                    value={theForm.fromHour}
                                                    onChange={(event, data) => changeParams("fromHour", data.value)}
                                                />
                                                <Form.Field
                                                    control={Select}
                                                    label={"Transaction Time End"}
                                                    options={transactionTimeOptions}
                                                    value={theForm.toHour}
                                                    onChange={(event, data) => changeParams("toHour", data.value)}
                                                />
                                            </Form.Group>
                                            {theForm.metricCriteria.map((x, i) => {
                                                return (
                                                    <Form.Group key={i}>
                                                        {theForm.metricCriteria.length > 1 && 
                                                            <Form.Field width={1}>
                                                                <div style={{position: "relative", top: "30px", cursor: "pointer"}}>
                                                                    <Icon name="remove circle" onClick={() => removeCriteria(i)} size="medium" color="red" />
                                                                </div>
                                                            </Form.Field>
                                                        }
                                                        <Form.Field
                                                            width={5}
                                                            control={Select}
                                                            label={"Metric"}
                                                            options={metricOptions}
                                                            placeholder={"Select Metric"}
                                                            value={theForm.metricCriteria[i].metricCode}
                                                            onChange={(event, data) => changeMetricCriteria("metricCode", data, i)}
                                                        />
                                                        <Form.Field
                                                            width={4}
                                                            control={Select}
                                                            label={"Compare Type"}
                                                            options={compareTypeOptions}
                                                            placeholder={"Select Compare Type"}
                                                            value={theForm.metricCriteria[i].compareType}
                                                            onChange={(event, data) => changeMetricCriteria("compareType", data, i)}
                                                        />
                                                        <Form.Field
                                                            width={3}
                                                            control={Input}
                                                            label={"Value"}
                                                            value={theForm.metricCriteria[i].value}
                                                            onChange={(event, data) => changeMetricCriteria("value", data, i)}
                                                            placeholder={"Value, e.g. 35"}
                                                        />
                                                        <Form.Field
                                                            width={4}
                                                            control={Select}
                                                            label={"Operator Type"}
                                                            options={operatorTypeOptions}
                                                            placeholder={"Type"}
                                                            value={theForm.metricCriteria[i].operatorType}
                                                            onChange={(event, data) => changeMetricCriteria("operatorType", data, i)}
                                                            disabled={i === 0 ? true : false}
                                                        />
                                                    </Form.Group>
                                                );
                                            })}

                                            <Form.Group>
                                                <Form.Field>
                                                    <Button type="button" onClick={() => addCriteria()} color="blue">Add Criteria</Button>
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
                            </Grid>
                        </Segment>
                    </Container>
                </Grid.Row>
                <Grid.Row>
                    <Container className="Container" fluid>
                        <Segment>
                            <Grid>
                                <Grid.Row columns={2}>
                                    <Grid.Column textAlign="left">
                                        <h2>Results</h2>
                                    </Grid.Column>
                                    <Grid.Column textAlign="right">
                                        {theResults.length >= itemsPerPage && 
                                            <Pagination
                                                className={"Page"}
                                                size="small"
                                                activePage={activePage}
                                                onPageChange={(event, data) => changePage(data)}
                                                ellipsisItem={{
                                                    content: <Icon name="ellipsis horizontal" />,
                                                    icon: true
                                                }}
                                                firstItem={null}
                                                lastItem={null}
                                                prevItem={null}
                                                nextItem={null}
                                                totalPages={Math.ceil(theResults.length / itemsPerPage)}
                                            />
                                        }
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <table>
                                <thead>
                                    <tr>
                                        <th>
                                            Restaurant Id</th>
                                        <th>
                                            Transaction Date
                                        </th>
                                        <th>
                                            Transaction Time
                                        </th>
                                        <th>
                                            Ticket Number
                                        </th>
                                        {metricDefinitions.map((m, i) => {
                                            return (
                                                <th key={i}>
                                                    {m.alias}
                                                </th>
                                            );
                                        })}
                                    </tr>
                                </thead>
                                {theResults &&
                                    <tbody>
                                        {slicedtheResults.map((arr, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td>
                                                        {arr["restaurantId"]}
                                                    </td>
                                                    <td>
                                                        {formatData(arr["busDt"], "Date", 0)}
                                                    </td>
                                                    <td>
                                                        {formatData(arr["orderTime"], "Time", 0)}
                                                    </td>
                                                    <td>
                                                        {arr["orderNumber"]}
                                                    </td>
                                                    {
                                                        metricDefinitions.map((m, i2) => {
                                                            const fieldName = m.metricCode[0].toLowerCase() + m.metricCode.substring(1);
                                                            return (
                                                                <td key={i2}>
                                                                    {formatData(arr[fieldName], m.dataType, m.decimalPlaces)}
                                                                </td>
                                                            );
                                                        })
                                                    }
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                }
                            </table>
                        </Segment>
                    </Container>
                </Grid.Row>
            </Grid>
        </div>  
    );
}

export default App;
