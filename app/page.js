'use client'
import Image from "next/image";
import { useState, useEffect } from 'react'
import {firestore, auth} from '@/firebase'
import {
  Box, 
  Typography, 
  Modal, 
  Stack, 
  TextField, 
  Button,
  AppBar,
  Toolbar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EditIcon from '@mui/icons-material/Edit';
import { query, collection, getDocs, deleteDoc, getDoc, setDoc, doc } from "firebase/firestore";
import {useAuthState} from "react-firebase-hooks/auth"
import {useRouter} from 'next/navigation'
import {signOut} from 'firebase/auth'

let userDocRef = null
let inventoryCollection = null

export default function Home() {
  const [user] = useAuthState(auth)
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [search, setSearch] = useState('')

  // Create function to update inventory
  const [editOpen, setEditOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [editName, setEditName] = useState('')
  const [editQuantity, setEditQuantity] = useState('')


  // Making sure it is a user
  const router = useRouter()
  if (!user){
    router.push('/sign-in')
  }else {
    userDocRef = doc(firestore, 'users', user.uid)
    inventoryCollection = collection(userDocRef, 'inventory')
  }

  // Opening and closing the modal
  const handleEditOpen = (item, name, quantity) => {
    setEditItem(item)
    setEditName(name)
    setEditQuantity(quantity.toString())
    setEditOpen(true)
  }
  const handleEditClose = () => {
    setEditOpen(false)
    setEditItem(null)
    setEditName('')
    setEditQuantity('')
  }

  // Function to update inventory
  const updateItem = async () => {
    if (editItem && editName) {
      const oldDocRef = doc(inventoryCollection, editItem)
      const newDocRef = doc(inventoryCollection, editName)
  
      if (editItem !== editName) {
        // If the name has changed, create a new document and delete the old one
        await setDoc(newDocRef, { quantity: parseInt(editQuantity) })
        await deleteDoc(oldDocRef)
      } else {
        // If only the quantity has changed, update the existing document
        await setDoc(oldDocRef, { quantity: parseInt(editQuantity) })
      }
  
      await updateInventory()
      handleEditClose()
    }
  }

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  const updateInventory = async () => {
    if(user){
      const snapshot = await getDocs(inventoryCollection)
      const inventoryList = []
      snapshot.forEach((doc)=>{
        inventoryList.push({
          name: doc.id,
          ...doc.data(),
        })
      })
      setInventory(inventoryList)
    }
  }

  const removeItem = async (item) => {
    const docRef = doc(inventoryCollection, item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()){
      const {quantity} = docSnap.data()
      if (quantity == 1){
        await deleteDoc(docRef)
      }
      else{
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }

    await updateInventory()
  }

  const addItem = async (item) => {
    const docRef = doc(inventoryCollection, item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()){
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    }
    else {
      await setDoc(docRef, {quantity: 1})
    }

    await updateInventory()
  }

  useEffect(() => {
    if(user){
      updateInventory()
    }
  }, [user])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box 
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f5f5f5",
        padding: 4
      }}
    >
      <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h3" component="div" left="10px" sx={{ flexGrow: 1, color: "#333" }}>
            Pantry Tracker
          </Typography>
          <Button variant="outlined" onClick={() => {
            signOut(auth)
            sessionStorage.removeItem('user')
          }}>
            Log Out
          </Button>
        </Toolbar>
      </AppBar>
  
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <TextField 
          variant="outlined" 
          placeholder="Search inventory" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: "70%" }}
        />
        <Button
          variant="contained"
          onClick={handleOpen}
          startIcon={<AddIcon />}
        >
          Add New Item
        </Button>
      </Box>
  
      <Paper elevation={3} sx={{ flexGrow: 1, overflow: "hidden" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Item Name</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInventory.map(({name, quantity}) => (
              <TableRow key={name}>
                <TableCell component="th" scope="row">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </TableCell>
                <TableCell align="right">{quantity}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => addItem(name)} size="small">
                    <AddIcon />
                  </IconButton>
                  <IconButton onClick={() => removeItem(name)} size="small">
                    <RemoveIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEditOpen(name, name, quantity)} size="small">
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
  
      
      <Modal open={open} onClose={handleClose}>
        <Paper sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          p: 4,
        }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Add Item</Typography>
          <TextField
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={() => {
              addItem(itemName)
              setItemName('')
              handleClose()
            }}
          >
            Add
          </Button>
        </Paper>
      </Modal>
  
      
      <Modal open={editOpen} onClose={handleEditClose}>
        <Paper sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          p: 4,
        }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Edit Item</Typography>
          <TextField 
            label="Item Name" 
            variant="outlined" 
            fullWidth 
            value={editName} 
            onChange={(e) => setEditName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField 
            label="Quantity" 
            variant="outlined" 
            type="number" 
            fullWidth 
            value={editQuantity} 
            onChange={(e) => setEditQuantity(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={updateItem}>
            Update
          </Button>
        </Paper>
      </Modal>
    </Box>
  )
}
