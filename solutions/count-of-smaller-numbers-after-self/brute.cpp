class Solution {
public:
    vector<int> countSmaller(vector<int>& nums) {
        int n = nums.size();
        vector<int> res(n);
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++) if (nums[j] < nums[i]) res[i]++;   // everything to the right
        return res;
    }
};
