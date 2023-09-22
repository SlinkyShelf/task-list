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
    // "fakeId": true
  }
}

const defaultFrameData = {
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
    "settings": {

    }
  }

export { defaultFrameData }