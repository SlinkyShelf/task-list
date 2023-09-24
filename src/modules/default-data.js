function objClone(obj)
{return JSON.parse(JSON.stringify(obj))}

const defaultTag = {
  "name": "School",
  "color": "#ff0000"
}

const defaultTask = {
  "name": "test",
  "metadata": {

  },
  "tags": {
    "fakeId": true
  }
}

const defaultTaskList = {
  "type": "task-list",
  "tags": {
    
  }
}

const defaultSettings = {

}

const defaultFrameData = {
  "title": "Frame Title",
  "type": "local",
    "documents": {
      "First List": {
        "type": "task-list",
        "tags": {
          "fakeId": true
        }
      },
    },
    "tags": {
      "fakeId": {
        "name": "School",
        "color": "#ff0000"
      }
    },
    "tasks": {
      "First Task": {
        "name": "test",
        "metadata": {

        },
        "tags": {
          "fakeId": true
        }
      }
    },
  }

const defaultUserData = {
  "frames": {

  },
  "settings": objClone(defaultSettings)
}

export { 
  defaultFrameData, 
  defaultSettings, 
  defaultUserData,  
  defaultTaskList, 
  defaultTag, 
  defaultTask, 
  objClone 
}