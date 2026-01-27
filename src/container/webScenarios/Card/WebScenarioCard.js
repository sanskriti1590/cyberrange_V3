import React, { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import HTMLRenderer from '../../../components/HtmlRendering';

const WebScenarioCard = ({
														thumbnail,
														name,
														assignedSeverity,
														timeLimit,
														description,
														display,
														actionComponent, // Custom button component with onClick passed as prop
												 }) => {
	 const [hide, setHide] = useState(true);

	 return (
		 <Stack
			 direction="row"
			 sx={{
					maxHeight: 'fit-content',
					width: '100%',
					gap: 2,
					backgroundColor: '#16181F',
					borderRadius: '12px',
					marginBottom: 3,
					filter: display === false ? 'blur(0.8px)' : 'none',
			 }}
		 >
				<img
					src={thumbnail}
					alt="thumbnail"
					style={{
						 height: '170px',
						 aspectRatio: 2 / 3,
						 borderRadius: '12px 0 0 12px',
						 objectFit: 'cover',
					}}
				/>

				<Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
					 <Stack justifyContent="space-around" sx={{ padding: 2 }}>
							<Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
								 <Stack direction="row" gap={2} sx={{ alignItems: 'center' }}>
										<Typography variant="h2">{name}</Typography>
										<Typography
											variant="body3"
											sx={{
												 color: '#BCBEC1',
												 backgroundColor: '#242833',
												 borderRadius: '16px',
												 padding: '4px 16px',
											}}
										>
											 {assignedSeverity}
										</Typography>
										<Typography
											variant="body3"
											sx={{
												 color: '#BCBEC1',
												 backgroundColor: '#242833',
												 borderRadius: '16px',
												 padding: '4px 16px',
											}}
											noWrap
										>
											 {timeLimit} Hour
										</Typography>
								 </Stack>
							</Stack>

							{/* Description Section */}
							{hide ? (
								<Stack sx={{ width: '100%' }}>
									 <Typography variant="h5" sx={{ color: '#BCBEC1' }}>
											{description.replace(/(<([^>]+)>)/gi, '').substring(0, 250)}
									 </Typography>
									 <Typography
										 sx={{
												textDecoration: 'none',
												cursor: 'pointer',
												color: '#0FF !important',
										 }}
										 onClick={() => setHide(!hide)}
									 >
											Read more
									 </Typography>
								</Stack>
							) : (
								<Stack sx={{ width: '100%' }}>
									 <HTMLRenderer htmlContent={description} />
									 <Typography
										 variant="h5"
										 sx={{
												textDecoration: 'none',
												cursor: 'pointer',
												color: '#0FF !important',
										 }}
										 onClick={() => setHide(!hide)}
									 >
											Read less
									 </Typography>
								</Stack>
							)}
					 </Stack>

					 {/* Action Component passed from parent */}
					 <Box>
							{actionComponent}
					 </Box>
				</Box>
		 </Stack>
	 );
};

export default WebScenarioCard;
