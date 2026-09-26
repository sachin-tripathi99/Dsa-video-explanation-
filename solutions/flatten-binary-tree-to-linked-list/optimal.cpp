class Solution {
public:
    void flatten(TreeNode* root) {
        TreeNode* cur = root;
        while (cur) {
            if (cur->left) {
                TreeNode* pre = cur->left;
                while (pre->right) pre = pre->right;        // rightmost of the left subtree
                pre->right = cur->right;                    // right subtree follows it
                cur->right = cur->left;                     // left subtree moves right
                cur->left = nullptr;
            }
            cur = cur->right;
        }
    }
};
