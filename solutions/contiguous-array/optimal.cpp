class Solution {
public:
    int findMaxLength(vector<int>& nums) {
        unordered_map<int, int> first{{0, -1}};    // balance 0 before the array starts
        int run = 0, best = 0;
        for (int i = 0; i < (int)nums.size(); i++) {
            run += nums[i] ? 1 : -1;
            auto it = first.find(run);
            if (it != first.end()) best = max(best, i - it->second);
            else first[run] = i;                   // keep only the first index
        }
        return best;
    }
};
