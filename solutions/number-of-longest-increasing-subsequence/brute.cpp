class Solution {
    int bestLen = 0, bestCnt = 0;
    void walk(vector<int>& a, int i, long long prev, int len) {   // every increasing subsequence
        if (i == (int)a.size()) {
            if (len > bestLen) { bestLen = len; bestCnt = 1; }
            else if (len == bestLen) bestCnt++;
            return;
        }
        if (a[i] > prev) walk(a, i + 1, a[i], len + 1);     // take
        walk(a, i + 1, prev, len);                          // skip
    }
public:
    int findNumberOfLIS(vector<int>& nums) {
        walk(nums, 0, LLONG_MIN, 0);
        return bestCnt;
    }
};
