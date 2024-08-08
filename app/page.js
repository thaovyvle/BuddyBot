'use client';

import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from 'react';
import Chat from './chat';

export default function Home() {
  const [showChat, setShowChat] = useState(false);

  const handleGoToChat = () => {
    setShowChat(true);
  };

  const handleGoBack = () => {
    setShowChat(false);
  };

  return (
    <Stack direction="row" justifyContent="center" alignItems="center" width="100vw" height="100vh" >
      {showChat ? (
        <Stack 
          direction="column" 
          justifyContent="center" 
          alignItems="center" 
          width="100%" 
          height="100%" 
        >
          <Stack 
            direction="row" 
            alignItems="center" 
            width="100%" 
            paddingX={3}
            backgroundColor={'#06a177'}
            position="sticky"
            top={0}
            zIndex={1}
          >
            <IconButton 
              onClick={handleGoBack} 
              sx={{ color: 'white', padding: '10px', backgroundColor: '#9bd9ad' }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant={'h5'} color={'white'} textAlign={'center'} fontWeight={"bold"} backgroundColor={'#06a177'} padding={'20px'} flexGrow={1} paddingLeft={'0px'}>
              Chat with AI Plant Assistant
            </Typography>
          </Stack>
          <Chat />
        </Stack>
      ) : (
        <>
          <Box display="flex" flexDirection="column" alignItems="flex-start" paddingLeft="20px" width='50vw'>
            <Typography variant={'h1'} color={'#06a177'} textAlign={'left'} fontWeight={"bold"} paddingBottom={'25px'}>
              PlantPal
            </Typography>
            <Typography variant={'p'} color={'#304840'} textAlign={'left'} paddingBottom={'60px'} paddingRight={'60px'}>
              Your AI plant assistant, offering expert advice on plant care and selection to help your plants flourish.
            </Typography>
            <Box
              component="img"
              src="/plants.png"
              alt="PlantPal Avatar"
              sx={{ maxWidth: '300px', width: '100%', height: 'auto', paddingBottom: '10px' }}
            />
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleGoToChat}
              sx={{ 
                backgroundColor: '#9bd9ad', 
                color: 'white', 
                borderRadius: "30px",
                width: '150px', 
                height: '50px',
                '&:hover': {
                  backgroundColor: '#06a177',
                },
                marginTop: '10px' 
              }}
            >
              Start Chat
            </Button>
          </Box>
          <Box
            component="img"
            src={'/plantRobot.png'}
            alt="AI Robot"
            sx={{ 
              maxWidth: '400px', 
              height: 'auto', 
              backgroundColor: '#fff9d4', 
              borderRadius: '50px', 
              padding: '20px', 
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
              display: showChat ? 'none' : 'block' // Hide the image when on chat page
            }}
          />
        </>
      )}
    </Stack>
  );
}
