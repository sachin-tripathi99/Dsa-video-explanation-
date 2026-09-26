class Solution {
public:
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
        if (preorder.empty()) return nullptr;
        TreeNode* root = new TreeNode(preorder[0]);
        int m = find(inorder.begin(), inorder.end(), preorder[0]) - inorder.begin();   // linear search
        vector<int> pl(preorder.begin() + 1, preorder.begin() + m + 1), il(inorder.begin(), inorder.begin() + m);
        vector<int> pr(preorder.begin() + m + 1, preorder.end()), ir(inorder.begin() + m + 1, inorder.end());
        root->left = buildTree(pl, il);
        root->right = buildTree(pr, ir);
        return root;
    }
};
