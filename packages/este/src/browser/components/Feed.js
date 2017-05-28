import React from 'react';
import { gql, graphql } from 'react-apollo';
import { Box, Button, Text } from '../../common/components/index';
import { Link } from './index';

function FeedList({ data }) {
  if (data.networkStatus === 1) {
    return <Text>Loading</Text>;
  }

  if (data.error) {
    return <Text>Error! {data.error.message}</Text>;
  }

  return (
    <Box>
      {data.feed.map(item => {
        const badge =
          item.repository.stargazers_count &&
          `☆ ${item.repository.stargazers_count}`;
        const name = `${item.repository.owner.login}/${item.repository.name}`;

        return (
          <Box key={name} margin={0.5}>
            {badge && <Text>{badge}</Text>}
            <Text>{name}</Text>
            <Text>{`Posted by ${item.postedBy.login}`}</Text>
          </Box>
        );
      })}
    </Box>
  );
}

function goToApolloWebsite() {
  window.location = 'http://dev.apollodata.com';
}

// The data prop here comes from the Apollo HoC. It has the data
// we asked for, and also useful methods like refetch().
function Feed({ data }) {
  return (
    <Box>
      <Text>GitHunt</Text>
      <FeedList data={data} />
      <Text>See the full app at </Text>
      <Link to="https://www.githunt.com">www.githunt.com</Link>
      <Button
        onPress={goToApolloWebsite}
        icon={{ name: 'code' }}
        backgroundColor="#22A699"
        title="Learn more about Apollo"
      >
        Learn more about Apollo
      </Button>
    </Box>
  );
}
// Apollo Client lets you attach GraphQL queries to
// your UI components to easily load data
const FeedWithData = graphql(
  gql`{
  feed (type: TOP, limit: 10) {
    repository {
      name, owner { login }

      # Uncomment the line below to get number of stars!
      # stargazers_count
    }

    postedBy { login }
  }
}`,
  { options: { notifyOnNetworkStatusChange: true } },
)(Feed);

// The above is a simple query that just gets some of the top
// posted repositories. You can use the GraphiQL query IDE to
// try writing new queries! Go to the link below:
// http://api.githunt.com/graphiql

// Try editing the code above:
// 1. Uncomment the stargazers_count line in the query to see
//    more data!
// 2. Don't forget to try starring the Apollo Client repository
//    and pull down to refresh the list to see the new number.

export default FeedWithData;
