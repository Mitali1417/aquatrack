import React from 'react'

export const formatAIResponse = (responseText) => {
    const lines = responseText.split("\n");
    const formattedContent = [];
    let currentList = null;
    let currentDepth = 0;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      const indentLevel = line.length - trimmedLine.length; // Measure indentation for nested bullets

      // Check and handle bold text inside ** **
      const boldRegex = /\*\*(.*?)\*\*/g;
      const formattedLine = trimmedLine.replace(boldRegex, (_, match) => {
        return match;
      });

      // Heading (Bold) detection
      if (formattedLine.endsWith(":") && !formattedLine.startsWith("**")) {
        formattedContent.push(
          <h5 key={index} className="font-bold text-gray-700 mt-4">
            {formattedLine}
          </h5>
        );
      } else if (formattedLine.startsWith("*")) {
        // Bullet Points (Nested lists)
        const listItem = (
          <li
            key={index}
            className={`ml-${indentLevel * 4} list-disc text-gray-700`}
          >
            {formattedLine.slice(1).trim()}
          </li>
        );

        if (indentLevel > currentDepth) {
          if (!currentList) {
            currentList = [];
          }
          currentList.push(listItem);
        } else if (indentLevel === currentDepth) {
          if (currentList) {
            formattedContent.push(
              <ul key={index} className="ml-5">
                {currentList}
              </ul>
            );
            currentList = [listItem];
          } else {
            formattedContent.push(listItem);
          }
        } else {
          // End of current list, output the current list and start new one
          if (currentList) {
            formattedContent.push(
              <ul key={index} className="ml-5">
                {currentList}
              </ul>
            );
            currentList = [listItem];
          }
        }
        currentDepth = indentLevel;
      } else if (currentList) {
        // End of a bullet point section
        formattedContent.push(
          <ul key={index} className="ml-5">
            {currentList}
          </ul>
        );
        currentList = null;
        formattedContent.push(
          <p key={index} className="text-gray-700">
            {formattedLine}
          </p>
        );
      } else {
        // Regular paragraph text
        formattedContent.push(
          <p key={index} className="text-gray-700">
            {formattedLine}
          </p>
        );
      }
    });

    return formattedContent;
  };