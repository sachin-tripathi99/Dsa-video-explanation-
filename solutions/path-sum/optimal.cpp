class Solution {
public:
    bool hasPathSum(TreeNode* root, int targetSum) {
        if (!root) return false;
        int remain = targetSum - root->val;
        if (!root->left && !root->right) return remain == 0;   // leaf
        return hasPathSum(root->left, remain) || hasPathSum(root->right, remain);
    }
};
