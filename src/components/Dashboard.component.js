import React, {useState, useEffect} from 'react'
import Calendar from 'react-calendar';
import axios from 'axios'
 



// const TopicList = (props) =>{

// 	var content
// 	const [topicList, setTopicList] = useState(null)
	
// 	useEffect(()=> {

// 		console.log("data at TopicList:", props.dayList)

// 	})
// 	let Topics = <p>Loading</p>
// 	if(props.dayList){
// 		Topics = props.dayList.map((topic, index) => {
// 			return(
// 				<div key={index} className="container-fluid p-1 my-1 border">
// 					<p className="text-danger">{topic.topic}</p>
// 					<p className="font-weight-bold">{topic.video}</p>
// 					<p>{topic.time} </p>
// 				</div>
// 			)
// 		}) 
// 	}
// 	return <Topics />

		
// }

const Topic = (props) => {

	return(
		<div key={props.index} className="container-fluid p-1 my-1 border">
			<p className="text-danger">{props.topic}</p>
			<p className="font-weight-bold">{props.video}</p>
			<p>{props.time} </p>
		</div>
		)
}

const TopicList = (props) =>{

	var content
	const [topicList, setTopicList] = useState(null)
	
	useEffect(()=> {

		console.log("data at TopicList:", props.dayList)

	})
	
	return(
		<div>
			{	
				props.dayList.map((topic, index) => {
					return <Topic index={index} 
						topic={topic.topic} 
						video={topic.video} 
						time={topic.time} 
					/> 
				})	
			}			
			
		</div>
		)

		
}

const Dashboard = (props) => {

	const [cnHours, changeCnHours] = useState({'secs' :1800})
	const [date, changeDate] = useState(new Date())
	const [cnData, changeCnData] = useState('')
	const [startDate, changeStartDate] = useState(new Date('9/1/2020'))
	const [topicsDate, changeTopicsDate] = useState(0)
	const [dayList, changeDayList] = useState()


	useEffect(() => {
		axios.get(`https://gate-plan.herokuapp.com/plan/cn`)
	      .then(res => {
	      	if(res.status === 200){
	      		console.log(res)
	      		document.getElementById('spinner').style.display = 'none'
	      		document.getElementById('topic-list-box').style.display = 'block'
	      		const data = res.data.data;
	      		changeCnData(data)
	      		//To render the list first time after fetching
	      		var Difference_In_Time = new Date().getTime() - startDate.getTime(); 
				var Difference_In_Days = Math.ceil(Difference_In_Time / (1000 * 3600 * 24));
				//update_List(the whole list, the index of the list item)

	      		update_List(res.data.data, parseInt(Difference_In_Days))
	      		changeTopicsDate(parseInt(Difference_In_Days))
	      	} else {
				document.getElementById('topic-list').innerHTML = 'Some error occured'	      		
	      	}
	        
	      })
	}, [])


	const buttonHandler = () => {
		console.log(cnData)
		update_List(cnData, topicsDate)
	}

	const update_List = (cnDataList, topicIndex) => {
		var cnDataObj = {}
		var time = 0
		var days = 0
		cnDataObj[days] = []
		
		for(var x=0; x<cnDataList.length; x+=1){

			if(time > cnHours.secs){
				cnDataObj[days].push(cnDataList[x])
				time = 0
				days += 1
				cnDataObj[days] = []
			} else {
				cnDataObj[days].push(cnDataList[x])
				time += parseInt(cnDataList[x]['seconds'])
				// console.log(time)
			}

		}

		console.log('day: ', topicIndex, cnDataObj[topicIndex]) //topics for selected date
		changeDayList(cnDataObj[topicIndex])
		// console.log(cnDataObj) All topics
	}


	const cnSliderHandler = () => {
		changeCnHours({'secs' : parseInt(document.getElementById('slide').value)})
		update_List(cnData, topicsDate)
		
	}

	const onDateChange = (value, event) => {
		console.log("clicked on: ", value)
		console.log(typeof(date))
		console.log(typeof(value))

		changeDate(value)

		var Difference_In_Time = value.getTime() - startDate.getTime(); 
		var Difference_In_Days = Math.ceil(Difference_In_Time / (1000 * 3600 * 24));

		console.log(Difference_In_Days)
		changeTopicsDate(parseInt(Difference_In_Days))
		update_List(cnData, Difference_In_Days)
	}

	return (
		<div>
		
			<div className="container  py-4 my-2 px-0">
				
				<h1> Dashboard </h1>
				<h4> Computer Networks : {(cnHours.secs/(60*60)).toPrecision(2)} hours  </h4>
				<div className="container-fluid p-2 row">
					<div className="container-fluid p-2 col-12 col-md-6 border">
						<h1> Day </h1>
						<h3> {date.toDateString()} </h3>

						<div id="topic-list" className="text-center p-2">
							<div id="spinner" className="spinner-border mt-5"></div>
							<div id='topic-list-box' style={{display: 'none'}}>
								{ dayList?
									<TopicList dayList={dayList} />:
									null
								}
							</div>
						</div>
					</div>
					<div className="container-fluid border p-2 col-12 col-md-6 text-center">
						<h1> Calendar </h1>
						<Calendar
				          onChange={onDateChange}
				          value={date}
				        />
	        		</div>
        		</div>
			</div>

			<div className="container border p-4 my-2 mb-5">
				<h1> Configure</h1>
				<label htmlFor="customRange">Select Hours per day for computer networks</label>
				<h5> { cnHours.secs } seconds </h5>
				<h5> {(cnHours.secs/(60*60)).toPrecision(2)} hours  </h5>
					<input onChange={cnSliderHandler} id='slide' type="range" className="custom-range" min="1800" max="10800" name="points1" />
				

					
			</div>
	
		</div>
		)
}

export default Dashboard