import React, {useEffect, useState} from 'react';
import {Collapse, Stack, Tab, Tabs, Typography} from '@mui/material';
import {TransitionGroup} from 'react-transition-group';
import SearchBar from '../../components/ui/SearchBar';
import BreadCrumbs from '../../components/navbar/BreadCrumb';
import WebScenarioCard from './Card/WebScenarioCard';
import {getWebScenariosByCategoryId, getWebScenarioUserCategories} from '../../APIConfig/webScenarioConfig';

const WebScenarioWithCategories = ({actionLabel, actionHandler, breadcrumbs}) => {
	 const [searchValue, setSearchValue] = useState('');
	 const [webScenarioCategories, setWebScenarioCategories] = useState([]);
	 const [filteredWebScenarioUserCategoriesData, setFilteredWebScenarioUserCategoriesData] = useState([]);
	 const [webScenarios, setWebScenarios] = useState([]);
	 const [selectedTab, setSelectedTab] = useState(0);

	 // Handle Search Input
	 const searchInputHandler = (value) => {
			setSearchValue(value);
			if (!value.trim()) {
				 setFilteredWebScenarioUserCategoriesData([]);
			} else {
				 const filteredData = webScenarioCategories.filter((item) =>
					 item?.name?.toLowerCase().includes(value.toLowerCase())
				 );
				 setFilteredWebScenarioUserCategoriesData(filteredData);
			}
	 };

	 // Fetch Web Scenario Categories and default Web Scenarios for the first category
	 useEffect(() => {
			const fetchCategories = async () => {
				 try {
						const response = await getWebScenarioUserCategories();
						const categories = response?.data || [];
						setWebScenarioCategories(categories);

						if (categories.length > 0) {
							 await handleCategoryClick(categories[0].category_id);
							 setSelectedTab(0);
						}
				 } catch (error) {
						console.error('Error fetching categories:', error);
				 }
			};

			fetchCategories();
	 }, []);

	 const handleTabChange = (event, newValue) => {
			setSelectedTab(newValue);
	 };

	 const handleCategoryClick = async (categoryId) => {
			try {
				 const response = await getWebScenariosByCategoryId(categoryId);
				 setWebScenarios(response?.data || []);
			} catch (error) {
				 console.error('Error fetching web scenarios:', error);
			}
	 };

	 const getActionComponent = (scenarioData) => (
		 <Typography
			 variant="h5"
			 onClick={() => actionHandler(scenarioData)}
			 sx={{
					margin: 3,
					cursor: 'pointer',
					padding: '4px 16px',
					minWidth: '120px',
					background: 'linear-gradient(45deg, #03688C 0%, #08BED0 100%)',
					borderRadius: '16px',
					textAlign: 'center',
					color: '#EAEAEB',
			 }}
		 >
				{actionLabel}
		 </Typography>
	 );

	 return (
		 <>
				<BreadCrumbs breadcrumbs={breadcrumbs}/>
				<Stack p={5}>
					 <Stack direction="row" justifyContent="space-between" alignItems="center">
							<Typography component="h1" variant="h2">
								 All Categories
							</Typography>
							<SearchBar value={searchValue} onChange={(event) => searchInputHandler(event.target.value.trimStart())}/>
					 </Stack>
					 <Tabs
						 value={selectedTab}
						 onChange={handleTabChange}
						 variant="scrollable"
						 scrollButtons="auto"
						 sx={{
								marginBottom: '22px',
								'& .MuiTabs-indicator': {
									 backgroundColor: '#00FFFF',
									 height: '4px',
								},
								'& .MuiTab-root': {
									 fontSize: '18px',
									 fontWeight: '500',
									 color: '#EAEAEB',
									 textTransform: 'capitalize',
								},
								'& .Mui-selected': {
									 fontWeight: '700',
									 color: '#00FFFF',
								},
						 }}
					 >
							{webScenarioCategories.map((category, index) => (
								<Tab
									key={category.id}
									label={category.name}
									value={index}
									onClick={() => handleCategoryClick(category.category_id)}
								/>
							))}
					 </Tabs>
					 <TransitionGroup>
							{webScenarios?.length > 0 ? (
								webScenarios.map((item, index) => (
									<Collapse in={true} key={index}>
										 <WebScenarioCard
											 key={index}
											 thumbnail={item.thumbnail}
											 name={item.name}
											 assignedSeverity={item.assigned_severity}
											 timeLimit={item.time_limit}
											 description={item.description}
											 display={index}
											 actionComponent={getActionComponent(item)}
										 />
									</Collapse>
								))
							) : null}
					 </TransitionGroup>
					 {webScenarios?.length === 0 && (
						 <Typography variant="h3" sx={{textAlign: 'center', mt: '50px'}}>
								No result found
						 </Typography>
					 )}
				</Stack>
		 </>
	 );
};

export default WebScenarioWithCategories;
