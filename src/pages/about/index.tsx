import React from "react"
import questions from "./questions"

const AboutPage: React.FunctionComponent = () => {
  return(
    <div>
      {questions.map(({q, a, id}) => 
        <div key={id} className="my-12">
          <div className="text-xl font-bold mb-4">{q}</div>
          <div className="text-lg">{a}</div>
          <hr className="border-gray-600 my-4"/>
        </div>
      )}
    </div>
  )
}

export default AboutPage