import React, {useState, useEffect} from 'react'
import Calendar from 'react-calendar';
import axios from 'axios'
 





const Topic = (props) => {

	useEffect(() => {
		// console.log(props)
		document.getElementById('span'+props.videoIndex).innerHTML = props.status
	})
	

	const statusHandler = (event) => {
		console.log(event.target.id)
		let url = event.target.id 
		url += props.status=='y'?'n':'y'

		axios.get('https://furqan-gate.herokuapp.com/plan/change/'+url)
		.then(res => {
			alert(res.data)
			// var span = document.getElementById('span'+props.videoIndex).innerHTML
			// span = span=='y'?'n':'y' 
			document.getElementById(props.sub).click()
		})
	 
	}


	return(
		<div key={props.index} className="container-fluid p-1 my-1 border">
			<p className="text-danger">{props.topic}</p>
			<p className="font-weight-bold">{props.video}</p>
			<p>{props.time} </p>
			<p> status: <span id={'span'+props.videoIndex}> </span> <span> <button class="btn btn-primary m-1 font-weight-bold" id={props.sub +'/' + props.videoIndex + '/' } onClick={statusHandler}>Change status </button></span> </p>
			
		</div>
		)
}

const TopicList = (props) =>{

	var content
	const [topicList, setTopicList] = useState(null)
	
	useEffect(()=> {

		// console.log("data at TopicList:", props.dayList)

	})
	
	return(
		<div>
			{	
				props.dayList.map((topic, index) => {
					return <Topic index={index} 
						topic={topic.topic} 
						video={topic.video} 
						time={topic.time} 
						key={index}
						videoIndex={topic.videoIndex}
						status={topic.status}
						sub={props.subject}
					/> 
				})	
			}			
		</div>
		)

		
}

const Dashboard = (props) => {

	const [cnHours, changeCnHours] = useState({'secs' :3600})
	const [date, changeDate] = useState(new Date())
	const [cnData, changeCnData] = useState('')
	const [startDate, changeStartDate] = useState(new Date('9/1/2020'))
	const [endDate, changeEndDate] = useState(new Date())
	const [topicsDate, changeTopicsDate] = useState(0)
	const [dayList, changeDayList] = useState()
	const [currentSub, changeCurrentSub] = useState('Computer Networks')
	const [shortSub, changeShortSub] = useState('cn')

	useEffect(() => {
		axios.get(`https://furqan-gate.herokuapp.com/plan/cn`)
	      .then(res => {
	      	if(res.status === 200){
	      		console.log(res)
	      		document.getElementById('spinner').style.display = 'none'
	      		document.getElementById('topic-list-box').style.display = 'block'
	      		const data = res.data.data;
	      		changeCnData(data)
	      		changeShortSub(res.data.subject)
	      		//To render the list first time after fetching
	      		var Difference_In_Time = new Date().getTime() - startDate.getTime(); 
				var Difference_In_Days = Math.ceil(Difference_In_Time / (1000 * 3600 * 24));
				//update_List(the whole list, the index of the list item)

	      		update_List(res.data.data, parseInt(Difference_In_Days) - 1)

	      		changeTopicsDate(parseInt(Difference_In_Days))
	      	} else {
				document.getElementById('topic-list').innerHTML = 'Some error occured'	      		
	      	}
	        
	      })
	}, [])

	function addDays(date, days) {
		  var result = new Date(date);
		  result.setDate(result.getDate() + days);
		  return result;
		}


	const update_List = (cnDataList, topicIndex) => {
		var cnDataObj = {}
		var time = 0
		var days = 0
		cnDataObj[days] = []
		
		for(var x=0; x<cnDataList.length; x+=1){

			
				if(time > cnHours.secs){
					x -= 1
					time = 0
					days += 1
					cnDataObj[days] = []
				} else {
					cnDataObj[days].push(cnDataList[x])
					time += parseInt(cnDataList[x]['seconds'])
					// console.log(time)
				}
			

		}
		changeEndDate(addDays(startDate, days))

		console.log('day: ', topicIndex, cnDataObj[topicIndex]) //topics for selected date
		changeDayList(cnDataObj[topicIndex])
		// console.log(cnDataObj) All topics
	}

	const changeSubject = (event) => {

		document.getElementById('spinner').style.display = 'block'
	    document.getElementById('topic-list-box').style.display = 'none'
		let subject = event.target.id
		console.log(event.target.innerHTML)
		changeCurrentSub(event.target.innerHTML)
		axios.get('https://furqan-gate.herokuapp.com/plan/'+subject)
	      .then(res => {
	      	if(res.status === 200){
	      		
	      		console.log(res)
	      		document.getElementById('spinner').style.display = 'none'
	      		document.getElementById('topic-list-box').style.display = 'block'
	      		const data = res.data.data;
	      		changeCnData(data)
	      		changeShortSub(res.data.subject)
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
		
			<div className="container  py-2 mt-2  mx-auto text-center">
				
				<h1> Dashboard : Aniket's Gate Plan </h1>
				<p> Phase 1 [Sep 2020 - Dec 2020] </p>
				<button id="cn" className="btn btn-danger text-white m-1 font-weight-bold" onClick={changeSubject}> Computer Networks </button>
				<button id="pds" className="btn btn-danger text-white m-1 font-weight-bold" onClick={changeSubject}> Programming and Data Structures</button>
				<button id="db" className="btn btn-danger text-white m-1 font-weight-bold" onClick={changeSubject}> Database </button>
				<h4> {currentSub} : {(cnHours.secs/(60*60)).toPrecision(2)} hours  </h4>
				<p>Start Date:<span className="font-weight-bold text-success"> {startDate.toDateString()} </span> | End Date: <span className="font-weight-bold text-danger"> {endDate.toDateString()} </span> </p>
				<div className="container-fluid mx-auto row text-center">
					<div className="container-fluid p-2 col-12 col-md-6 border">
						<h1> Day </h1>
						<h3> {date.toDateString()} </h3>

						<div id="topic-list" className="text-center p-2">
							<div id="spinner" className="text-center">
								<div className="spinner-border mt-5"></div>
							</div>
							
							<div id='topic-list-box' style={{display: 'none'}}>
								{ dayList?
									<TopicList dayList={dayList} subject={shortSub} />:
									null
								}
							</div>
						</div>
					</div>
					<div className="container-fluid border p-2 col-12 col-md-6 text-center">
						<h1 className="mb-4"> Calendar </h1>
						<Calendar
							className="mt-5 py-2"
				          	onChange={onDateChange}
				          	value={[startDate]}
			         	  	tileClassName={({ activeStartDate, date, view }) => view === 'month' && date.getTime() === endDate.getTime() ? 'end-date' : null}
				        />
	        		</div>
        		</div>
			</div>

			<div className="container border p-4 my-2 mb-5" style={{display: 'none'}}>
				<h1> Configure</h1>
				<label htmlFor="customRange">Select Hours per day for computer networks</label>
				<h5> { cnHours.secs } seconds </h5>
				<h5> {(cnHours.secs/(60*60)).toPrecision(2)} hours  </h5>
					<input onChange={cnSliderHandler} id='slide' type="range" className="custom-range" min="3600" max="10800" name="points1" />
		
			</div>
	
		</div>
		)
}

export default Dashboard
