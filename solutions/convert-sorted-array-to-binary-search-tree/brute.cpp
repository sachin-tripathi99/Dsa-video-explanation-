class Solution {
public:
    TreeNode* sortedArrayToBST(vector<int>& nums) {
        if (nums.empty()) return nullptr;
        int m = nums.size() / 2;
        TreeNode* root = new TreeNode(nums[m]);
        vector<int> left(nums.begin(), nums.begin() + m), right(nums.begin() + m + 1, nums.end());   // copies
        root->left = sortedArrayToBST(left);
        root->right = sortedArrayToBST(right);
        return root;
    }
};
