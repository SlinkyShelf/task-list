const defaultFirebaseData = {
    "lists": {
      "test-list-folder-1": {
        "type": "folder",
        "lists": {
          "test-folder-1": {
            "type": "folder",
            "lists": {
              "test-list": {
                "type": "list"
              },
              "test-list-2": {
                "type": "list"
              }
            }
          },
          "test-folder-2": {
            "test-list": {
                "type": "list"
              },
              "test-list-2": {
                "type": "list"
              }
          }
        }
      },
      "test-list-folder-2": {
        "type": "folder",
        "lists": {}
      } 
    }
  }

export default defaultFirebaseData