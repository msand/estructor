import React from 'react';
import {
  Text,
  StyleSheet,
  Linking,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { gql, graphql } from 'react-apollo';
import { List, ListItem, Button } from 'react-native-elements';

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    margin: 20,
    marginBottom: 0,
  },
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#ecf0f1',
  },
  learnMore: {
    margin: 20,
    marginTop: 0,
  },
  loading: {
    margin: 50,
  },
  list: {
    marginBottom: 20,
  },
  fullApp: {
    marginBottom: 20,
    textAlign: 'center',
  },
});

// The above is a simple query that just gets some of the top
// posted repositories. You can use the GraphiQL query IDE to
// try writing new queries! Go to the link below:
// http://api.githunt.com/graphiql

// Try editing the code above:
// 1. Uncomment the stargazers_count line in the query to see
//    more data!
// 2. Don't forget to try starring the Apollo Client repository
//    and pull down to refresh the list to see the new number.

function FeedList({ data }) {
  if (data.networkStatus === 1) {
    return <ActivityIndicator style={styles.loading} />;
  }

  if (data.error) {
    return <Text>Error! {data.error.message}</Text>;
  }

  return (
    <List containerStyle={styles.list}>
      {data.feed.map(item => {
        const badge = item.repository.stargazers_count && {
          value: `☆ ${item.repository.stargazers_count}`,
          badgeContainerStyle: { right: 10, backgroundColor: '#56579B' },
          badgeTextStyle: { fontSize: 12 },
        };

        return (
          <ListItem
            hideChevron
            title={`${item.repository.owner.login}/${item.repository.name}`}
            subtitle={`Posted by ${item.postedBy.login}`}
            badge={badge}
          />
        );
      })}
    </List>
  );
}

function goToApolloWebsite() {
  Linking.openURL('http://dev.apollodata.com');
}

// The data prop here comes from the Apollo HoC. It has the data
// we asked for, and also useful methods like refetch().
function Feed({ data }) {
  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        // This enables the pull-to-refresh functionality
        <RefreshControl
          refreshing={data.networkStatus === 4}
          onRefresh={data.refetch}
        />
      }
    >
      <Text style={styles.title}>GitHunt</Text>
      <FeedList data={data} />
      <Text style={styles.fullApp}>See the full app at www.githunt.com</Text>
      <Button
        buttonStyle={styles.learnMore}
        onPress={goToApolloWebsite}
        icon={{ name: 'code' }}
        raised
        backgroundColor="#22A699"
        title="Learn more about Apollo"
      />
    </ScrollView>
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

export default FeedWithData;
