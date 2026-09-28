class Solution {
    int best = 0, half;
    void search(vector<int>& a, int i, int sum) {           // every subset as group B
        if (sum > half) return;
        best = max(best, sum);
        if (i == (int)a.size()) return;
        search(a, i + 1, sum + a[i]);
        search(a, i + 1, sum);
    }
public:
    int lastStoneWeightII(vector<int>& stones) {
        int total = accumulate(stones.begin(), stones.end(), 0);
        half = total / 2;
        search(stones, 0, 0);
        return total - 2 * best;
    }
};
