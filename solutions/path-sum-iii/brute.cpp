class Solution {
    int from(TreeNode* n, long long remain) {               // paths starting at n
        if (!n) return 0;
        remain -= n->val;
        return (remain == 0) + from(n->left, remain) + from(n->right, remain);
    }
public:
    int pathSum(TreeNode* root, int targetSum) {
        if (!root) return 0;
        return from(root, targetSum) + pathSum(root->left, targetSum) + pathSum(root->right, targetSum);   // every start
    }
};
