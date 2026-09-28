class Solution {
public:
    int lastStoneWeightII(vector<int>& stones) {
        int total = accumulate(stones.begin(), stones.end(), 0);
        int half = total / 2;
        vector<bool> dp(half + 1, false);                   // dp[s]: a group can weigh s
        dp[0] = true;
        for (int x : stones)
            for (int c = half; c >= x; c--) dp[c] = dp[c] || dp[c - x];
        int s = half;
        while (!dp[s]) s--;                                 // closest to half
        return total - 2 * s;
    }
};
