class Solution {
public:
    vector<int> findErrorNums(vector<int>& nums) {
        int n = nums.size(), dup = 0, miss = 0;
        vector<int> count(n + 1, 0);
        for (int x : nums) count[x]++;
        for (int x = 1; x <= n; x++) {
            if (count[x] == 2) dup = x;
            if (count[x] == 0) miss = x;
        }
        return {dup, miss};
    }
};
