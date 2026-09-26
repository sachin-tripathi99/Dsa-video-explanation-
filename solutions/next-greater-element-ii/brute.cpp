class Solution {
public:
    vector<int> nextGreaterElements(vector<int>& nums) {
        int n = nums.size();
        vector<int> ans(n, -1);
        for (int i = 0; i < n; i++)
            for (int k = 1; k < n; k++)
                if (nums[(i + k) % n] > nums[i]) { ans[i] = nums[(i + k) % n]; break; }
        return ans;
    }
};
