class Solution {
    vector<vector<int>> memo;
    int half;
    int best(vector<int>& a, int i, int sum) {              // largest reachable sum ≤ half
        if (i == (int)a.size()) return sum;
        int& m = memo[i][sum];
        if (m != -1) return m;                              // solved before
        int r = best(a, i + 1, sum);
        if (sum + a[i] <= half) r = max(r, best(a, i + 1, sum + a[i]));
        return m = r;
    }
public:
    int lastStoneWeightII(vector<int>& stones) {
        int total = accumulate(stones.begin(), stones.end(), 0);
        half = total / 2;
        memo.assign(stones.size(), vector<int>(half + 1, -1));
        return total - 2 * best(stones, 0, 0);
    }
};
