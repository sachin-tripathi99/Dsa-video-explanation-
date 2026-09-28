class Solution {
    TreeNode* build(vector<int>& a, int lo, int hi) {
        if (lo > hi) return nullptr;
        int m = lo + (hi - lo) / 2;                         // middle of the range = root
        TreeNode* root = new TreeNode(a[m]);
        root->left = build(a, lo, m - 1);
        root->right = build(a, m + 1, hi);
        return root;
    }
public:
    TreeNode* sortedArrayToBST(vector<int>& nums) {
        return build(nums, 0, nums.size() - 1);
    }
};
