# Database Utilities

This directory contains utility scripts for managing the ToDo application database. These scripts help you clear data, reset the database, and perform maintenance operations while preserving important admin users.

## Available Scripts

### 1. `clearDatabase.js` - Comprehensive Database Cleanup

A full-featured utility for clearing database content with multiple options and safety features.

#### Usage
```bash
cd backend
node utils/clearDatabase.js [options]
```

#### Options
- `--preserve-admins` - Keep all users with admin role (default)
- `--preserve-specific` - Keep only specific admin emails (err2k24@gmail.com, nithinpula123@gmail.com)
- `--clear-all` - Remove everything including all users
- `--tasks-only` - Remove only tasks, keep all users
- `--users-only` - Remove only non-admin users, keep all tasks
- `--dry-run` - Show what would be deleted without actually deleting
- `--help` - Show help information

#### Examples
```bash
# Default: Keep all admins, remove everything else
node utils/clearDatabase.js

# Keep only specific protected admins
node utils/clearDatabase.js --preserve-specific

# Remove only tasks
node utils/clearDatabase.js --tasks-only

# Preview what would be deleted
node utils/clearDatabase.js --dry-run

# Nuclear option: remove everything
node utils/clearDatabase.js --clear-all
```

### 2. `quickDB.js` - Quick Database Operations

A simple utility for common database operations with single commands.

#### Usage
```bash
cd backend
node utils/quickDB.js <command>
```

#### Commands
- `stats` - Show current database statistics
- `clear-tasks` - Delete all tasks
- `clear-users` - Delete all non-admin users
- `clear-test-users` - Delete test users (keep protected admins)
- `clear-completed` - Delete completed tasks only
- `clear-old [days]` - Delete completed tasks older than X days (default: 30)
- `reset-admins` - Reset to admin users only (delete everything else)

#### Examples
```bash
# Show database statistics
node utils/quickDB.js stats

# Clear all tasks
node utils/quickDB.js clear-tasks

# Clear completed tasks older than 7 days
node utils/quickDB.js clear-old 7

# Reset to admin users only
node utils/quickDB.js reset-admins
```

## Protected Admin Users

The following admin users are protected and won't be deleted (except with `--clear-all`):
- err2k24@gmail.com
- nithinpula123@gmail.com

## Safety Features

1. **Dry Run Mode**: Test operations without making actual changes
2. **Protected Admins**: Specific admin accounts are preserved
3. **Detailed Logging**: Clear feedback on what's being deleted
4. **Statistics**: Before and after statistics to track changes
5. **Error Handling**: Comprehensive error handling and reporting
6. **Confirmation Delays**: 3-second delay before destructive operations

## Database Schema

The utilities work with:
- **Users Collection**: Contains user accounts with roles (admin, manager, user)
- **Tasks Collection**: Contains user tasks with various statuses and properties

## Environment Setup

Make sure your `.env` file contains:
```
MONGODB_URI=your_mongodb_connection_string
```

## Common Use Cases

### Development Environment Reset
```bash
# Reset to clean state with only admin users
node utils/quickDB.js reset-admins
```

### Testing Data Cleanup
```bash
# Remove test users but keep tasks
node utils/clearDatabase.js --users-only --preserve-specific
```

### Production Maintenance
```bash
# Remove old completed tasks (safer for production)
node utils/quickDB.js clear-old 30
```

### Complete Fresh Start
```bash
# Preview what will be deleted
node utils/clearDatabase.js --clear-all --dry-run

# Actually clear everything
node utils/clearDatabase.js --clear-all
```

## Integration with Seeding

After clearing the database, you can repopulate it with sample data:
```bash
# Clear database
node utils/clearDatabase.js

# Seed with fresh data
node utils/seedDB.js
```

## Troubleshooting

1. **Connection Issues**: Verify your MONGODB_URI in .env file
2. **Permission Errors**: Ensure your MongoDB user has delete permissions
3. **Validation Errors**: Check that your schema models are properly defined

## Script Output

Both scripts provide detailed output including:
- ✅ Success messages with counts
- ❌ Error messages with details
- 📊 Statistics and summaries
- 🛡️ Information about preserved data
- 🔍 Dry run previews

## Best Practices

1. Always use `--dry-run` first to preview changes
2. Backup your database before running destructive operations
3. Use specific options rather than `--clear-all` when possible
4. Check statistics before and after operations
5. Test in development environment first

## Security Notes

- Admin users with protected emails cannot be deleted accidentally
- The scripts require proper MongoDB connection credentials
- No data is sent over network - operations are local to your database
- All operations are logged for audit purposes
