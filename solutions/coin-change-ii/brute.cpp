class Solution {
    int count(vector<int>& coins, int i, int remaining) {
        if (remaining == 0) return 1;
        if (i == (int)coins.size() || remaining < 0) return 0;
        return count(coins, i + 1, remaining) + count(coins, i, remaining - coins[i]);   // done with coin i, or one more
    }
public:
    int change(int amount, vector<int>& coins) {
        return count(coins, 0, amount);
    }
};
