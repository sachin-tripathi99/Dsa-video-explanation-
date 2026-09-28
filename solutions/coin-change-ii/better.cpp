class Solution {
    vector<vector<int>> memo;
    int count(vector<int>& coins, int i, int remaining) {
        if (remaining == 0) return 1;
        if (i == (int)coins.size() || remaining < 0) return 0;
        int& m = memo[i][remaining];
        if (m != -1) return m;                              // solved before
        return m = count(coins, i + 1, remaining) + count(coins, i, remaining - coins[i]);
    }
public:
    int change(int amount, vector<int>& coins) {
        memo.assign(coins.size(), vector<int>(amount + 1, -1));
        return count(coins, 0, amount);
    }
};
