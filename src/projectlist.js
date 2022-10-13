import React, { useState, useEffect } from 'react';
import { message, Select, Input, Button, AutoComplete, Form, Table } from "antd";
const { Option } = Select;
import { Link, Navigate, Routes, Route } from "react-router-dom";


import { auth } from './firebase';
import { collection, query, doc, setDoc, getDocs, addDoc } from "firebase/firestore";

import "./App.css";
import { db, storr } from './firebase/firebase';
import TextArea from 'antd/lib/input/TextArea';
import Tags from './tags';


//       },
//       {
//         title: 'Description',
//         dataIndex: 'title',
//         width: '20%',
//         inputType: 'areaa',
//         editable: true,





//   makeid(length) {
//     var result = '';
//     var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     var charactersLength = characters.length;
//     for (var i = 0; i < length; i++) {
//       result += characters.charAt(Math.floor(Math.random() * charactersLength));
//     }
//     return result;
//   }









const ProjectList = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [tempStatus, setTempStatus] = useState([]);
  const [editingKey, setEditingKey] = useState('');

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    // const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    const inputNode = inputType === 'area' ? <TextArea
      onKeyDown={(event) => {
        let charCode = String.fromCharCode(event.which).toLowerCase();
        if ((event.ctrlKey || event.metaKey) && charCode === 's') {
          event.preventDefault();
          save(record.key)
        }
      }}
    /> : <Input
      onKeyDown={(event) => {
        let charCode = String.fromCharCode(event.which).toLowerCase();
        if ((event.ctrlKey || event.metaKey) && charCode === 's') {
          event.preventDefault();
          save(record.key)
        }
      }}
    />;

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  useEffect(() => {
    pullFromDB()

    // auth.whenAuthStateChanged((user) => {
    //   if (user) {
    //     setEmail(user.email)
    //   }
    // });
  }, []);

  const pullFromDB = async () => {

    try {

      // We listen for live changes to our events collection in Firebase
      const q = query(collection(db, "applications"));

      const snapshot = await getDocs(q);
      let data = [];

      snapshot.forEach(doc => {
        const todo = doc.data();
        todo.id = doc.id;
        data.push(todo);
      });

      // Sort our data based on time added
      data.sort(function (a, b) {
        return (
          b.timestamp - a.timestamp
        );
      });

      //assign primary key
      for (var i = 0; i < data.length; i++) {
        console.log(data[i])
        data[i].key = i;
      }

      // Anytime the state of our database changes, we update state
      setData(data)
      // setColumns(newa)

    } catch (error) {
      message.destroy()
      message.error(JSON.stringify(error));
    }
  }

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ name: '', age: '', address: '', ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };
  const onStatusChange = (e) => {
    let d = [...data]
    d[editingKey].status = e
    console.log(d[editingKey].status)
    // setData(d)
  };

  const savey = async (arr) => {
    let d = [...data]
    d[editingKey].status = arr
  }

  const save = async (key) => {
    try {
      const row = (await form.validateFields())

      const newData = [...data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });

        console.log(item.id)
        console.log(newData[index])
        message.loading('Saving...')

        await setDoc(doc(db, "applications", item.id), newData[index]);
        message.destroy()
        message.success("Document successfully updated!");
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const addApplication = async (x) => {
    alert('cc')
    await addDoc(collection(db, "applications"), {
      timestamp: Date.now()
    })
  }

  const onChange = (value) => {

    console.log(`selected ${data}`);
  };

  const onSearch = (value) => {
    console.log('search:', value);
  };

  const columns = [
    {
      title: '',
      dataIndex: 'key',
      width: '5%',
    },
    {
      title: 'timestamp',
      dataIndex: 'timestamp',
      width: '15%',
      render: (text, record) => {
        return (new Date(text).toLocaleString())
      }
    },
    {
      title: 'name',
      dataIndex: 'name',
      editable: true,
      render: (text, record) => {
        return (
          <div>
            <Button type="primary" ghost><Link to={'/app/' + record.id}>{text}</Link></Button>
          </div>
        );
      },
    },
    {
      title: 'link',
      dataIndex: 'link',
      width: '15%',
      editable: true,
      render: (text, record) => {
        return (
          <a href={text} target='blank'>link</a>
        )
      }
    },
    {
      title: 'status',
      dataIndex: 'status',
      render: (text, record) => {
        const editable = isEditing(record);


        if(text == null) text = []
        return editable ? (
          <Tags arr={text} savey={savey} />
        ) : (text[text.length - 1])
      }
    },
    {
      title: 'note',
      dataIndex: 'note',
      width: '25%',
      editable: true,
    },
    {
      title: '',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              href=""
              onClick={e => {
                e.preventDefault()
                save(record.key)
              }}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Button>
            <Button type="primary" onClick={() => cancel(record.key)}>Cancel</Button>
          </span>
        ) : (
          <div>
            <Button disabled={editingKey !== ''} onClick={() => edit(record)}>
              Edit
            </Button>
          </div>
        );
      },
    },
  ];

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'note' ? 'area' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <div className="App">
      <Input.Group compact>
        <Input style={{ width: '200px' }} />
        <Button type="primary" onClick={() => addApplication()}>add</Button>
      </Input.Group>
      <Form form={form} component={false}>
        <Table



          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
    </div>
  );
};

export default ProjectList;
;