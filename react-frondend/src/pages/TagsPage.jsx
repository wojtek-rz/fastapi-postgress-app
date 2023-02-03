import { Input, Heading, Tag, FormControl, FormLabel, Divider, Flex, Button, Circle, Spinner } from '@chakra-ui/react'
import { useState } from 'react';
import { useGetRequest } from '../hooks/useRequest';
import { useToast } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
export default function TagsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [tags, setTags] = useState([]);
    const [searchText, setSearchText] = useState('');
    const toast = useToast();

    const handleSubmit = (e) => {
    
        e.preventDefault();
        setTags([])
        setIsLoading(true)
        useGetRequest('/tags/', {params: {contains: searchText, limit: 300}}).then((tags) => {
            setTags(tags);
            setIsLoading(false)
        }).catch((err) => {
            console.log("error", err)
            toast({
                title: 'Error',
                description: err.response.data.detail,
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            setIsLoading(false)
        })
    }

    const handleLoadMore = (e) => {
        setIsLoading(true)
        console.log(tags.length)
        useGetRequest('/tags/', {params: {contains: searchText, limit: 300, skip: tags.length}}).then((newTags) => {
            setTags([...tags, ...newTags]);
            setIsLoading(false)
        }).catch((err) => {
            toast({
                title: 'Error',
                description: err.response.data.detail,
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            setIsLoading(false)
        })
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <FormLabel><Heading as="h1" size="xl" mb={4}>Find tags:</Heading></FormLabel>
                <Input onChange={(e) => {setSearchText(e.target.value)}} placeholder='Type tag name' />
                <Button mt="5" type="submit">Search</Button>
            </form>
            <Divider my={6} />
            <Heading as="h2" size="lg" my={4}>Results:</Heading>
            <Flex flexWrap={'wrap'} gap='2'>
                {tags.length === 0 && <p>No results</p>}
                {tags.map((tag) => tag.name && (
                        <Tag key={tag.id} size="lg"  colorScheme="orange" _hover={{textDecoration: 'underline'}} >
                            <Link to={`/recipes?tags=${tag.name.replace(' ', '+')}`}>{tag.name}</Link>
                        </Tag>
                    
                ))}
            </Flex>
            <Button isDisabled={tags.length % 300} mt="5" onClick={handleLoadMore}>
                Load more
            </Button>
            {isLoading && <Spinner />}
        </>
    );
}