class Solution {
public:
    int findTheWinner(int n, int k) {
        vector<int> friends(n);
        iota(friends.begin(), friends.end(), 1);
        int idx = 0;
        while (friends.size() > 1) {
            idx = (idx + k - 1) % friends.size();   // k-th friend, counting the start
            friends.erase(friends.begin() + idx);    // next count starts at this index
        }
        return friends[0];
    }
};
