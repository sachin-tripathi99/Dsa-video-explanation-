class Solution {
public:
    int longestConsecutive(vector<int>& nums) {
        unordered_set<long long> s(nums.begin(), nums.end());
        int best = 0;
        for (long long x : s) {
            if (s.count(x - 1)) continue;             // not the start of a run
            int length = 1;
            while (s.count(x + length)) length++;
            best = max(best, length);
        }
        return best;
    }
};
