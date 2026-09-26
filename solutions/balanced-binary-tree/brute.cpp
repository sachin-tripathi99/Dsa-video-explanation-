class Solution {
    int height(TreeNode* n) {                               // recomputed at every level
        return n ? 1 + max(height(n->left), height(n->right)) : 0;
    }
public:
    bool isBalanced(TreeNode* root) {
        if (!root) return true;
        return abs(height(root->left) - height(root->right)) <= 1 && isBalanced(root->left) && isBalanced(root->right);
    }
};
