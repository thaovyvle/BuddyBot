'use client'

import { Box, Button, Stack, TextField } from '@mui/material'
import { useState, useRef, useEffect } from 'react'

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm PlantPal, your plant support assistant. How can I help you today?",
    },
  ])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    console.log("Messages 1: ", message) // TODO: remove later

    if (!message.trim() || isLoading) return;
    setIsLoading(true)

    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ])
    setMessage('')

    console.log("Messages 2:", messages)
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({messages: [...messages, {role: 'user', content: message}]}),
      })
  
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
  
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
  
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value, { stream: true })
        console.log(text)
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ]
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ])
    }
    setIsLoading(false)
  }


  /* For OpenAI
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm BuddyBot, your support assistant. How can I help you today?",
    },
  ])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true)
  
    setMessage('')
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ])
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({messages: messages}),
      })
  
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
  
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
  
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value, { stream: true })
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ]
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ])
    }
    setIsLoading(false)
  }
  */
 
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
    console.log("Message 3: ", messages)
  }, [messages])

  return (
    <Stack display="flex" justifyContent="center" alignItems="center" width="100vw" height="100vh" >
    <Box
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      backgroundColor='#fffbdf'
    >
      <Stack
        direction="column"
        width="70%"
        height="100%"
        padding="20px"
        margin='20px'
        backgroundColor='white'
        borderRadius={10}
        spacing={2}
        overflow="hidden"
        boxShadow="0px 4px 10px rgba(0, 0, 0, 0.4)"
      >
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          padding={1}
        >
          {messages.map((message, index) => (
            <Box
            key={index}
            display="flex"
            justifyContent={
              message.role === 'assistant' ? 'flex-start' : 'flex-end'
            }
            alignItems="center" 
          >
            {message.role === 'assistant' && (
              <Box
                component="img"
                src="/assistantAvatar.png" 
                alt="Assistant"
                sx={{
                  width: 55, 
                  height: 55,
                  marginRight: 1, 
                }}
              />
            )}
            
            <Box
              bgcolor={
                message.role === 'assistant'
                  ? '#86ba95'
                  : '#06a177'
              }
              color="white"
              borderRadius={message.role === 'assistant' 
                  ? '16px 16px 16px 0px' 
                  : '16px 16px 0px 16px'}
              p={3}
            >
              {message.content}
            </Box>
            
            {message.role === 'user' && (
              <Box
                component="img"
                src="/userAvatar.png" 
                alt="User"
                sx={{
                  width: 55,
                  height: 55,
                  marginLeft: 1, 
                }}
              />
            )}
          </Box>
          
          ))}
          <div ref={messagesEndRef} />
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isLoading}
            sx={{
                borderRadius: '30px', 
                '& .MuiOutlinedInput-root': {
                  borderRadius: '30px',
                  '&:hover fieldset': {
                    borderColor: '#048c66', 
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#048c66',

                  },
                },
              }}
          />
          <Button variant="contained" onClick={sendMessage} disabled={isLoading}
          sx={{
            borderRadius: '15px',
            backgroundColor: '#06a177', 
            '&:hover': {
              backgroundColor: '#048c66',
            },
          }}>
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </Stack>
      </Stack>
    </Box>
    </Stack>
  )
}