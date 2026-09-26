class Solution {
    int height(TreeNode* n) {                               // recomputed for every ancestor
        return n ? 1 + max(height(n->left), height(n->right)) : 0;
    }
public:
    int diameterOfBinaryTree(TreeNode* root) {
        if (!root) return 0;
        int through = height(root->left) + height(root->right);   // path bending here
        return max({through, diameterOfBinaryTree(root->left), diameterOfBinaryTree(root->right)});
    }
};
