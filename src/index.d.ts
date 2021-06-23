import CommandHandler from '../packages/CommandHandler';
import Settings from './struct/Settings';
import Db from './struct/Database';

declare module 'discord.js' {
	interface Client {
		db: Db
		settings: Settings;
		commandHandler: CommandHandler
	}
}
